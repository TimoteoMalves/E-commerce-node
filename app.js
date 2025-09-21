import express from "express";

import productController from "./controllers/productController.js";
import clientController from "./controllers/clientController.js";
import OrderController from "./controllers/orderController.js";
const app = express();

const orderController = new OrderController();

const port = 3000;

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the e-commerce API!");
});

// #region Product Routes

// Get all products
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
    console.log("Filter received");
    const { id } = req.params;
    const filteredProduct = await productController.filterProduct(parseInt(id));

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
app.put("/products/:id/stock", async (req, res) => {
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

// #region Client

// Create new client
app.post("/clients", async (req, res) => {
  console.log("Create cliente received");
  console.log(req.body);
  await clientController.create(req, res);
});

// Get client by ID
app.get("/clients/:id", async (req, res) => {
  console.log("Create cliente received");
  await clientController.getById(req, res);
});

// Update client by ID
app.put("/clients/:id", async (req, res) => {
  console.log("Create cliente received");
  await clientController.update(req, res);
});

// #region Order Routes

// Create a new order
app.post("/orders", async (req, res) => {
  await orderController.create(req, res);
});

// Get all orders for a specific client (Required Method)
app.get("/clients/:id/orders", async (req, res) => {
  console.log("Get order received");
  await orderController.getOrdersByClient(req, res);
});

// Update order's payment status
app.put("/orders/:id/status", async (req, res) => {
  console.log("Update order received");
  await orderController.updateStatus(req, res);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
