import express from "express";
const app = express();
const PORT = 3002;
import productController from "./src/controllers/productController.js";

app.use(express.json());

// Seeds
const defaultProducts = [
  {
    name: "Bicicleta",
    description: "Monark",
    price: 3000,
    stock: 20,
  },
  {
    name: "Fogão",
    description: "Brastemp",
    price: 801,
    stock: 20,
  },
  {
    name: "Geladeira",
    description: "Brastemp",
    price: 2700,
    stock: 50,
  },
];

//Seeding
async function seedDefaultProducts() {
  console.log("Iniciando o seeding de produtos...");

  for (const productData of defaultProducts) {
    try {
      const res = {
        status: (statusCode) => {
          if (statusCode === 409) {
            console.log(
              `[SEEDING] Produto '${productData.name}' já existe. Ignorando.`
            );
          }
          return res;
        },
        json: (data) => {
          return data;
        },
        send: (msg) => {
          if (msg && msg.includes("already exists")) {
            console.log(
              `[SEEDING] Produto '${productData.name}' já existe. Ignorando.`
            );
          }
        },
      };

      console.log("Starting seeding");
      await productController.registerProduct(productData, res);

      console.log(
        `[SEEDING] Produto '${productData.name}' inserido/verificado com sucesso.`
      );
    } catch (error) {
      console.error(
        `[SEEDING ERROR] Falha ao inserir produto ${productData.name}:`,
        error.message
      );
    }
  }
  console.log("Seeding de produtos concluído.");
}

// --- ROTAS ---

app.get("/products", async (req, res) => {
  console.log("fetchAll received");
  await productController.fetchAll(req, res);
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
  console.log("Filter received");
  await productController.filterProduct(req, res);
});

// Create new product
app.post("/products", async (req, res) => {
  console.log("register received");
  await productController.registerProduct(req.body, res);
});

// Update product by ID
app.put("/products/:id", async (req, res) => {
  const data = req.body;

  if (data.hasOwnProperty("stock")) {
    res.status(400).json({
      message:
        "Operation not allowed. The product's stock must be updated using its specific route.",
    });
    return;
  }

  console.log("edit received");
  const { id } = req.params;
  await productController.editProduct(parseInt(id), req.body, res);
});

// Update stock
app.patch("/products/:id/stock", async (req, res) => {
  console.log("edit received");
  const { id } = req.params;
  await productController.editProduct(parseInt(id), req.body, res);
});

// Delete product by ID
app.delete("/products/:id", async (req, res) => {
  console.log("delete received");
  const { id } = req.params;
  await productController.deleteProduct(parseInt(id), res);
});

async function startServer() {
  await seedDefaultProducts();

  app.listen(PORT, () => {
    console.log(`[Product Service] listening on port: ${PORT}`);
  });
}

startServer();
