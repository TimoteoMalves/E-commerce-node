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

    app.listen(PORT, () => {
      console.log(`[Payment Service] listening on port: ${PORT}`);
    });
  } catch (error) {
    console.log("Erro connecting to kafka");
    process.exit(1);
  }
}

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

    producer.send({
      topic: TOPIC_NAME,
      messages: [message],
    });

    console.log(
      `[x] Evento 'PedidoCriado' enviado ao tópico '${TOPIC_NAME}': ${message.value}`
    );
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

// app.listen(PORT, () => {
//   console.log(`[Payment Service] listening on port: ${PORT}`);
// });

initializeApp();
