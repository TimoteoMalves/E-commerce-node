import axios from "axios";

// Variável de ambiente para a URL do Product Service
const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://product-service:3002";

class ProductApi {
  async deductStock(items) {
    console.log(`[ProductApi] PATCH ${PRODUCT_SERVICE_URL}/products/:id/stock`);

    try {
      const results = [];

      for (const item of items) {
        console.log(
          `[ProductApi] Deduzindo estoque do produto ${item.productId} (quantidade: ${item.quantity})`
        );

        const response = await axios.patch(
          `${PRODUCT_SERVICE_URL}/products/${item.productId}/stock`,
          { quantity: item.quantity } // manda só a quantidade
        );

        results.push(response.data);
      }

      return results;
    } catch (error) {
      console.error(`[ProductApi] ERRO ao deduzir estoque: ${error.message}`);
      throw new Error(
        `Failed to deduct product stock: ${
          error.response?.data?.message || "Gateway connection error."
        }`
      );
    }
  }

  async getProduct(productId) {
    console.log(
      `[ProductApi] GET ${PRODUCT_SERVICE_URL}/products/${productId}`
    );

    try {
      const response = await axios.get(
        `${PRODUCT_SERVICE_URL}/products/${productId}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  }
}

export default ProductApi;
