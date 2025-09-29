import productRepository from "../repository/productRepository.js";

class ProductController {
  // GET /products
  async fetchAll() {
    return productRepository.fetchAll();
  }

  // GET /products/:id
  async filterProduct(id) {
    return productRepository.getById(id);
  }

  // POST /products
  async registerProduct(productData) {
    return productRepository.create(productData);
  }

  // PUT /products/:id e PUT /products/:id/stock
  async editProduct(id, updatedData) {
    return productRepository.update(id, updatedData);
  }

  // DELETE /products/:id
  async deleteProduct(id) {
    return productRepository.remove(id);
  }
}

export default new ProductController();
