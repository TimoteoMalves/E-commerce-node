const express = require("express");
const productController = require("./controllers/productController");

const app = express();

const port = 3000;

app.use(express.json());

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await productController.fetchAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error getting products." });
  }
});

// Filter product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const filteredProduct = await productController.filterProduct(parseInt(id));

    if (filteredProduct) {
      res.json(filteredProduct);
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error filtering product." });
  }
});

// Register product
app.post("/product", async (req, res) => {
  try {
    const newProduct = await productController.registerProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Edit product by ID
app.put("/product/:id", async (req, res) => {
  try {
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

app.delete("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await productController.deleteProduct(parseInt(id));
    res.status(200).json({ message: `Product deleted` });
  } catch (error) {
    res.status(500).json({ message: `Error deleting the product` });
  }
});

// Get order
app.get("/order", async (req, res) => {
  try {
    const orders = await productController.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error getting orders." });
  }
});

// Create a new order
app.post("/order", async (req, res) => {
  try {
    const newOrder = await productController.createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
