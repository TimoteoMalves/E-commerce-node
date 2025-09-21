import { PrismaClient } from "@prisma/client";

// 2. Instantiate the Prisma Client
const prisma = new PrismaClient();

const productController = {
  // READ: Get all products (Replaces fetchAll)
  fetchAll: async () => {
    return await prisma.product.findMany({
      orderBy: { name: "asc" },
    });
  },

  // READ: Get product by ID (Replaces filterProduct)
  filterProduct: async (id) => {
    return await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
  },

  // UPDATE: Edit product by ID (Replaces editProduct)
  editProduct: async (id, updatedData) => {
    return await prisma.product.update({
      where: {
        id: id,
      },
      data: updatedData,
    });
  },

  // CREATE: Register product (Replaces registerProduct)
  registerProduct: async (newProduct) => {
    return await prisma.product.create({
      data: newProduct,
    });
  },

  // DELETE: Delete product by ID (Replaces deleteProduct)
  deleteProduct: async (id) => {
    return await prisma.product.delete({
      where: {
        id: id,
      },
    });
  },
};

export default productController;
