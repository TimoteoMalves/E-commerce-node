import express from "express";
const app = express();
const PORT = 3001;
import clientController from "./src/controllers/clientController.js";

app.use(express.json());

// Seed
const defaultClients = [
  {
    firstName: "Fabricio",
    lastName: "Bruno",
    email: "naomereceu@gmail.com",
  },
  {
    firstName: "Gabriel",
    lastName: "Magalhaes",
    email: "Magalhaes@gmail.com",
  },
];

// Seeding
async function seedDefaultClients() {
  console.log("Iniciando o seeding de clientes...");

  for (const clientData of defaultClients) {
    try {
      const req = {
        body: clientData,
      };

      let clientExists = false;
      const res = {
        status: (statusCode) => {
          if (statusCode === 409) {
            clientExists = true;
          }
          return res;
        },
        json: (data) => {
          return data;
        },
        send: (msg) => {
          if (msg.includes("already exists")) {
            clientExists = true;
          }
        },
      };

      await clientController.create(req, res);

      if (clientExists) {
        console.log(
          `[SEEDING] Cliente '${clientData.email}' já existe. Ignorando.`
        );
      } else {
        console.log(
          `[SEEDING] Cliente '${clientData.email}' inserido com sucesso.`
        );
      }
    } catch (error) {
      console.error(
        `[SEEDING ERROR] Falha ao inserir cliente ${clientData.email}:`,
        error.message
      );
    }
  }
  console.log("Seeding de clientes concluído.");
}

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

async function startServer() {
  await seedDefaultClients();

  app.listen(PORT, () => {
    console.log(`[Client Service] listening on port: ${PORT}`);
  });
}

startServer();
