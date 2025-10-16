import express from "express";
const app = express();
const PORT = 3001;
import clientController from "./src/controllers/clientController.js";

app.use(express.json());

// Create new client
app.post("/clients", async (req, res) => {
  console.log("POST client received");
  await clientController.create(req, res);
});

// Get client by ID
app.get("/clients/:id", async (req, res) => {
  console.log("GET client received");
  await clientController.getById(req, res);
});

// Get all clients
app.get("/clients", async (req, res) => {
  console.log("GET all clients received");
  await clientController.fetchAllClients(req, res);
});

// Update client by ID
app.put("/clients/:id", async (req, res) => {
  console.log("UPDATE client received");
  await clientController.update(req, res);
});

app.listen(PORT, () => {
  console.log(`[Client Service] listening on port: ${PORT}`);
});
