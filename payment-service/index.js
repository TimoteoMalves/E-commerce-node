import express from "express";
import amqp from "amqplib";
import paymentController from "./src/controllers/paymentController.js";
const app = express();
const PORT = 3004;

const RABBITMQ_URL = "amqp://admin:admin@rabbitmq:5672";
const EXCHANGE_NAME = "payments_exchange";
const EXCHANGE_TYPE = "fanout";

app.use(express.json());

let channel;

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
});

async function initializeApp() {
  try {
    await connectAndSetupRabbitMQ();

    app.listen(PORT, () => {
      console.log(`[Payment Service] listening on port: ${PORT}`);
    });
  } catch (err) {
    console.error("🚨 Falha ao iniciar o serviço. Terminando...", err);
    process.exit(1);
  }
}

// // POST payment
// app.post("/payments", (req, res) => {
//   console.log("POST payment received");
//   paymentController.create(req, res);
// });

// GET payment
app.get("/payments/:id", (req, res) => {
  console.log("GET payment received");
  paymentController.getById(req, res);
});

app.post("/payments/method", (req, res) => {
  console.log("POST payment type");
});

// PATCH processo pagamento
app.patch("/payments/:id/status", (req, res) => {
  console.log("PATCH payment received");
  paymentController.updateStatus(req, res);
});

app.listen(PORT, () => {
  console.log(`[Payment Service] listening on port: ${PORT}`);
});

initializeApp();
