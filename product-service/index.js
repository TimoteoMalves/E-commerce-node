import express from "express";
const app = express();
const PORT = 3002;
import productController from "./src/controllers/productController.js";

app.use(express.json());

app.get("/products", async (req, res) => {
  try {
    console.log("fetchAll received");
    const products = await productController.fetchAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error getting products." });
  }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Filter received");
    console.log(`Id received: ${id}`);
    const filteredProduct = await productController.filterProduct(id);

    if (filteredProduct) {
      res.json(filteredProduct);
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product." });
  }
});

// Create new product
app.post("/products", async (req, res) => {
  try {
    console.log("register received");
    const newProduct = await productController.registerProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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

  try {
    console.log("edit received");
    const { id } = req.params;
    const updatedProduct = await productController.editProduct(
      parseInt(id),
      req.body
    );

    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update stock
app.patch("/products/:id/stock", async (req, res) => {
  try {
    console.log("edit received");
    const { id } = req.params;
    const updatedProduct = await productController.editProduct(
      parseInt(id),
      req.body
    );

    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product by ID
app.delete("/products/:id", async (req, res) => {
  try {
    console.log("delete received");
    const { id } = req.params;
    await productController.deleteProduct(parseInt(id));
    res.status(200).json({ message: `Product deleted` });
  } catch (error) {
    res.status(500).json({ message: `Error deleting the product` });
  }
});

app.listen(PORT, () => {
  console.log(`[Client Service] listening on port: ${PORT}`);
});
