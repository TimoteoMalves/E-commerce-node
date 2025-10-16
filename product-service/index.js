import express from "express";
const app = express();
const PORT = 3002;
import productController from "./src/controllers/productController.js";

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`[Client Service] listening on port: ${PORT}`);
});
