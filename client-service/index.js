import express from "express";
const app = express();
const PORT = 3001;
import clientController from "./src/controllers/clientController.js";

app.use(express.json());

// Create new client
app.post("/clients", async (req, res) => {
  console.log("POST client received");
  try {
    const client = await clientController.create(req, res);
    res.status(204).json({ client });
  } catch (error) {
    res.status(500).json({ message: "Error creating client." });
  }
});

// Get client by ID
app.get("/clients/:id", async (req, res) => {
  console.log("GET client received");
  try {
    const client = await clientController.getById(req, res);
    if (!client) {
      res.status(200).json({ message: "No clients were found" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error getting client." });
  }
});

// Get all clients
app.get("/clients", async (req, res) => {
  console.log("GET all clients received");
  await clientController.fetchAllClients(req, res);
});

// Update client by ID
app.put("/clients/:id", async (req, res) => {
  console.log("UPDATE client received");
  try {
    const updatedClient = await clientController.update(req, res);

    if (!updatedClient) {
      res.status(200).json({ message: "No client was found" });
    }

    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: "Error updating the client." });
  }
});

app.listen(PORT, () => {
  console.log(`[Client Service] listening on port: ${PORT}`);
});
