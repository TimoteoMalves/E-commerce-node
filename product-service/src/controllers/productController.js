import productRepository from "../repository/productRepository.js";

class ProductController {
  // GET /products
  async fetchAll(req, res) {
    try {
      const products = await productRepository.fetchAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(406).json({ message: error });
    }
  }

  // GET /products/:id
  async filterProduct(req, res) {
    const { id } = req.params;
    console.log(`Id received: ${id}`);
    try {
      const filteredProduct = await productRepository.getById(id);

      if (filteredProduct) {
        res.status(200).json(filteredProduct);
      } else {
        res.status(406).json({ message: `No product with id ${id} was found` });
      }
    } catch (error) {
      res.status(406).json({ message: error });
    }
  }

  // POST /products
  async registerProduct(productData, res) {
    try {
      const newProduct = await productRepository.create(productData);
      res.status(200).json(newProduct);
    } catch (error) {
      res.status(406).json({ message: error });
    }
  }

  // PUT /products/:id e PUT /products/:id/stock
  async editProduct(id, updatedData, res) {
    try {
      const updatedProduct = await productRepository.update(id, updatedData);
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(406).json({ message: error });
    }
  }

  // DELETE /products/:id
  async deleteProduct(id, res) {
    try {
      await productRepository.remove(id);
      res.status(203).json({ message: `Product ${id} deleted` });
    } catch (error) {
      res.status(406).json({ message: error });
    }
    return productRepository.remove(id);
  }
}

export default new ProductController();
