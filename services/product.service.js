import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ProductService {
  async fetchAll() {
    return prisma.product.findMany({
      orderBy: { name: "asc" },
    });
  }

  async getById(id) {
    return prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }

  /**
   * Creates a new product in the database.
   * @param {object} productData - The data for the new product.
   */
  async create(productData) {
    if (!productData.name || !productData.price) {
      throw new Error("Product name and price are required.");
    }
    if (typeof productData.price !== "number" || productData.price <= 0) {
      throw new Error("Price must be a positive number.");
    }
    // Prisma create method
    return prisma.product.create({
      data: productData,
    });
  }

  /**
   * Updates an existing product.
   * @param {number} id - The product's ID.
   * @param {object} updatedData - Fields to update.
   */
  async update(id, updatedData) {
    if (
      updatedData.price &&
      (typeof updatedData.price !== "number" || updatedData.price <= 0)
    ) {
      throw new Error("Price must be a positive number.");
    }
    // Prisma update method
    return prisma.product.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });
  }

  /**
   * Deletes a product by its ID.
   * @param {number} id - The product's ID.
   */
  async remove(id) {
    // Prisma delete method
    return prisma.product.delete({
      where: { id: parseInt(id) },
    });
  }
}

export default new ProductService();
