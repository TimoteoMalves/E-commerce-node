class Product {
  constructor(id, name, description, price, stock) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
  }

  isAvailable() {
    return this.stock > 0;
  }
}

const mockDatabase = [
  {
    id: 1,
    name: "Laptop",
    description: "A powerful laptop.",
    price: 1200,
    stock: 5,
  },
  {
    id: 2,
    name: "Mouse",
    description: "A wireless mouse.",
    price: 25,
    stock: 50,
  },
  {
    id: 3,
    name: "Keyboard",
    description: "A mechanical keyboard.",
    price: 75,
    stock: 0,
  },
];

class ProductModel {
  // fetch all data
  async fetchAll() {
    return mockDatabase;
  }

  // filter product
  async getById(id) {
    console.log("ola");
    const product = mockDatabase.find((p) => p.id === id);
    console.log(product);
    return product || null;
  }

  // create product
  async create(productData) {
    if (!productData.name || !productData.price) {
      throw new Error("Product name and price are required.");
    }
    if (typeof productData.price !== "number" || productData.price <= 0) {
      throw new Error("Price must be a positive number.");
    }

    const newId =
      mockDatabase.length > 0
        ? Math.max(...mockDatabase.map((p) => p.id)) + 1
        : 1;
    const newProduct = {
      id: newId,
      name: productData.name,
      description: productData.description || "",
      price: productData.price,
      stock: productData.stock || 0,
    };

    mockDatabase.push(newProduct);

    return newProduct;
  }

  // Update product
  async update(id, updatedData) {
    const productIndex = mockDatabase.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return null;
    }

    if (
      updatedData.price &&
      (typeof updatedData.price !== "number" || updatedData.price <= 0)
    ) {
      throw new Error("Price must be a positive number.");
    }
    const updatedProduct = { ...mockDatabase[productIndex], ...updatedData };
    mockDatabase[productIndex] = updatedProduct;

    return updatedProduct;
  }

  // Delete product
  async remove(id) {
    const initialLength = mockDatabase.length;
    const productIndex = mockDatabase.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      mockDatabase.splice(productIndex, 1);
    }
    return mockDatabase.length < initialLength;
  }
}

module.exports = new ProductModel();
