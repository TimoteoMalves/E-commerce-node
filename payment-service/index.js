import express from "express";
const app = express();
const PORT = 3004;
import paymentController from "./src/controllers/paymentController.js";

app.use(express.json());

// POST payment
app.post("/payments", (req, res) => {
  console.log("POST payment received");
  paymentController.create(req, res);
});

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
