import express from "express";
import { Kafka } from "kafkajs";
import OrderController from "./src/controllers/orderController.js";
const app = express();
const PORT = 3003;

app.use(express.json());

const kafkaClient = new Kafka({
  clientId: "pedido-producer",
  brokers: ["kafka:9094"],
});

const producer = kafkaClient.producer();
const TOPIC_NAME = "pedidos";

// Seeding
const defaultOrders = [
  {
    clientId: 1,
    description: "Primeiro Pedido do Cliente 1",
    totalPrice: 17000.0,
    products: [
      { id: 1, quantity: 1, subtotal: 5000 },
      { id: 2, quantity: 2, subtotal: 12000 },
    ],
  },
  {
    clientId: 2,
    description: "Primeiro Pedido do Cliente 2",
    totalPrice: 5000.0,
    products: [{ id: 1, quantity: 1, subtotal: 5000 }],
  },
];

//Seeding
async function seedDefaultOrders() {
  console.log("Iniciando o seeding de pedidos...");

  for (const orderSeed of defaultOrders) {
    try {
      // Simulação da Requisição:
      const req = {
        params: { id: orderSeed.clientId }, // ID do Cliente na URL (clients/:id)
        body: orderSeed,
      };

      // Simulação da Resposta:
      const res = {
        status: (statusCode) => {
          return res;
        },
        json: (data) => {
          return data;
        },
        send: (msg) => {},
      };

      console.log("Starting seeding");
      const newOrder = await OrderController.create(req, res);

      console.log(
        `[SEEDING] Pedido criado para Cliente ID ${orderSeed.clientId} (MongoDB ID: ${newOrder.id})`
      );
    } catch (error) {
      console.error(
        `[SEEDING ERROR] Falha ao inserir pedido para Cliente ${orderSeed.clientId}:`,
        error.message
      );
    }
  }
  console.log("Seeding de pedidos concluído.");
}

// --- 3. INÍCIO DO SERVIDOR APÓS O SEEDING E KAFKA ---

async function connectAndSetupKafka() {
  try {
    await producer.connect();
    console.log("Produtor conectado ao Kafka e pronto para enviar eventos.");
  } catch (error) {
    console.error("Erro no produtor Kafka:", error);
    await producer.disconnect();
    process.exit(1);
  }
}

async function initializeApp() {
  try {
    await connectAndSetupKafka();

    // 🚨 AQUI ENTRA O SEEDING, DEPOIS DO KAFKA ESTAR CONECTADO
    await seedDefaultOrders();

    app.listen(PORT, () => {
      console.log(`[Order Service] listening on port: ${PORT}`);
    });
  } catch (error) {
    console.log("Erro connecting to kafka or seeding failed");
    process.exit(1);
  }
}

// --- ROTAS (Não modificadas) ---

// Create a new order
app.post("/orders/clients/:id", async (req, res) => {
  console.log("POST order received");
  try {
    const order = await OrderController.create(req, res);

    const pedido = {
      id: order.id,
      cliente: req.params.id,
      valor: order.totalPrice,
      criadoEm: new Date().toISOString(),
    };

    const message = {
      key: pedido.id.toString(),
      value: JSON.stringify(pedido),
    };

    const deliveryResult = await producer.send({
      topic: TOPIC_NAME,
      messages: [message],
    });

    console.log(
      `[x] Evento 'PedidoCriado' enviado ao tópico '${TOPIC_NAME}': ${message.value} na Partição ${deliveryResult[0].partition}`
    );
    res.status(200).json({ Message: "Order created succefully" });
  } catch (error) {
    console.log(`Error creating order`);
  }
});

// Get all orders for a specific client (Required Method)
app.get("/clients/:id/orders", async (req, res) => {
  console.log("GET client orders received");
  const { id } = req.params;
  console.log(id);
  try {
    const clientOrders = await OrderController.getOrdersByClient(id);

    if (!clientOrders) {
      res
        .status(400)
        .json({ message: `No order were found for client ${req.body.id}` });
    }
    res.status(200).json(clientOrders);
  } catch (error) {
    res.status(400).json({ message: "Erro getting client's orders" });
  }
});

app.get("/orders/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Get order ${id}`);
  try {
    const order = await OrderController.getOrderById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Update order's payment status
app.patch("/orders/:id/status", async (req, res) => {
  console.log("PATCH order status received");
  try {
    await OrderController.updateStatus(req, res);
    res.status(204);
  } catch (error) {
    res.status(400).json({ message: "Error updating status" });
  }
});

initializeApp();
