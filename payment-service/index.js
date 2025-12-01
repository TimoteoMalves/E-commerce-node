import express from "express";
import amqp from "amqplib";
import { Kafka } from "kafkajs";
import paymentController from "./src/controllers/paymentController.js";
// Importação necessária para fazer requisições HTTP entre serviços
import fetch from "node-fetch";

const app = express();
const PORT = 3004;

const RABBITMQ_URL = "amqp://admin:admin@rabbitmq:5672";
const EXCHANGE_NAME = "payments_exchange";
const EXCHANGE_TYPE = "fanout";

const ORDER_SERVICE_BASE_URL = "http://order-service:3003";
const CLIENT_ID_TO_SEED = "1";

app.use(express.json());

let channel;

const paymentSeedTemplate = {
  paymentTypeId: 1,
  gatewayReference: "SEED_T23",
};

async function seedDefaultPayments() {
  console.log("Iniciando o seeding de pagamentos...");

  try {
    console.log(
      `[SEEDING] Buscando pedidos do Cliente ${CLIENT_ID_TO_SEED} em ${ORDER_SERVICE_BASE_URL}...`
    );

    const response = await fetch(
      `${ORDER_SERVICE_BASE_URL}/clients/${CLIENT_ID_TO_SEED}/orders`
    );

    if (!response.ok) {
      throw new Error(
        `Falha ao buscar pedidos: ${response.status} ${response.statusText}`
      );
    }

    const orders = await response.json();

    if (!orders || orders.length === 0) {
      console.log(
        "[SEEDING] Nenhuma ordem encontrada para o Cliente 1. Ignorando seeding de pagamentos."
      );
      return;
    }

    console.log(
      `[SEEDING] Encontrados ${orders.length} pedidos. Criando pagamentos...`
    );
    for (const order of orders) {
      const paymentData = {
        ...paymentSeedTemplate,
        orderId: order.id, // O ID do MongoDB do pedido
        amount: order.totalPrice, // O valor total do pedido
      };

      const req = { body: paymentData };
      const res = {
        status: (statusCode) => {
          return res;
        },
        json: (data) => {
          return data;
        },
        send: (msg) => {},
      };

      try {
        await paymentController.create(req, res);
        console.log(
          `[SEEDING] Pagamento criado com sucesso para Order ID: ${order.id}`
        );
      } catch (error) {
        console.error(
          `[SEEDING ERROR] Falha ao criar pagamento para Order ID ${order.id}:`,
          error.message
        );
      }
    }
  } catch (error) {
    console.error(
      "🚨 [SEEDING GLOBAL ERROR] Falha na orquestração do seeding de pagamentos:",
      error.message
    );
  }
  console.log("Seeding de pagamentos concluído.");
}

// #region Kafka

const KAFKA_BROKERS = ["kafka:9094"]; // ⬅️ O mesmo broker do serviço de pedidos
const KAFKA_TOPIC = "pedidos"; // ⬅️ O tópico a ser consumido
const KAFKA_GROUP_ID = "payment-consumer-group"; // ⬅️ Grupo de consumo

const kafka = new Kafka({
  clientId: "payment-consumer",
  brokers: KAFKA_BROKERS,
});
const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });

async function connectAndSetupKafkaConsumer() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const orderData = JSON.parse(message.value.toString());

        console.log(`\n🎉 [Kafka] Pedido Recebido: Tópico: ${topic}`);
        console.log("Conteúdo do Pedido:", orderData);
      },
    });

    console.log(
      `Consumidor Kafka conectado e escutando o tópico: ${KAFKA_TOPIC}`
    );
  } catch (error) {
    console.error("🚨 Erro no consumidor Kafka:", error);
    // Tenta reconectar o consumidor após um atraso em caso de falha crítica
    setTimeout(connectAndSetupKafkaConsumer, 10000);
  }
}

//#endregion

// #region RabbitMQ

async function connectAndSetupRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
      durable: false,
    });

    console.log("Produtor conectado ao RabbitMQ e pronto para enviar eventos.");
    return channel;
  } catch (error) {
    console.error("Erro no produtor RabbitMQ:", error);
    // Tenta reconectar após um tempo
    setTimeout(connectAndSetupRabbitMQ, 10000);
    throw error;
  }
}

//#endregion
-(
  // POST /payments (Rota principal com RabbitMQ)
  app.post("/payments", async (req, res) => {
    if (!channel) {
      return res
        .status(503)
        .send("Serviço indisponível. Conexão com RabbitMQ pendente.");
    }

    const paymentData = req.body;

    const message = JSON.stringify({
      ...paymentData,
      criadoEm: new Date().toISOString(),
    });

    try {
      const success = channel.publish(EXCHANGE_NAME, "", Buffer.from(message));

      if (success) {
        console.log(`[x] Evento 'PagamentoRecebido' enviado: ${message}`);
        res.status(202).send({
          message: "Pagamento recebido e processado na fila.",
          data: paymentData,
        });
      } else {
        res
          .status(500)
          .send("Falha ao enviar mensagem para a fila (buffer cheio).");
      }
    } catch (error) {
      console.error("Erro ao publicar mensagem no RabbitMQ:", error);
      res.status(500).send("Erro interno ao processar a requisição.");
    }
  })
);

// Outras rotas (Sem RabbitMQ/Kafka envolvido)
app.post("/payments", (req, res) => {
  console.log("POST payment received");
  paymentController.create(req, res);
});

// GET payment
app.get("/payments/:id", (req, res) => {
  console.log("GET payment received");
  paymentController.getById(req, res);
});

//-----------------------
app.post("/payments/method", (req, res) => {
  console.log("POST payment type");
  // Esta rota poderia ser usada para fazer o seeding de payment types!
});
//-----------------------

// PATCH processo pagamento
app.patch("/payments/:id/status", (req, res) => {
  console.log("PATCH payment received");
  paymentController.updateStatus(req, res);
});

async function initializeApp() {
  try {
    // 1. CONEXÃO COM BROKERS
    await connectAndSetupRabbitMQ();
    await connectAndSetupKafkaConsumer();

    await seedDefaultPayments();

    app.listen(PORT, () => {
      console.log(`[Payment Service] listening on port: ${PORT}`);
    });
  } catch (err) {
    console.error("🚨 Falha ao iniciar o serviço. Terminando...", err);
    process.exit(1);
  }
}

initializeApp();
