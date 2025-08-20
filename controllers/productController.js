const productModel = require("../services/models/productModel");
const orderModel = require("../services/models/orderModel");

const productController = {
  fetchAll: async () => {
    return await productModel.fetchAll();
  },

  filterProduct: async (id) => {
    return await productModel.getById(id);
  },

  editProduct: async (id, updatedData) => {
    return await productModel.update(id, updatedData);
  },

  registerProduct: async (newProduct) => {
    return await productModel.create(newProduct);
  },

  deleteProduct: async (id) => {
    return await productModel.remove(id);
  },
};

module.exports = productController;
