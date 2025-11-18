import { PrismaClient } from "@prisma/client";
import ProductApi from "../services/productApi.js";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();
const productApi = new ProductApi();

class OrderRepository {
  async createOrder(description, totalPrice, clientId, products) {
    try {
      console.log(`Create dentro do repository`);

      for (const product of products) {
        try {
          console.log(`Product id ${product.id}`);
          const response = await productApi.getProduct(product.id);
          console.log(`Estoque verificado`);

          if (response.stock < product.quantity) {
            throw new Error(`Produto ${product.id} sem estoque suficiente`);
          }
        } catch (err) {
          console.error(
            `Erro ao verificar estoque do produto ${product.id}:`,
            err.message
          );
          throw new Error(`Erro ao verificar estoque`);
        }
      }

      console.log(`Iniciando criação no banco`);

      return prisma.order.create({
        data: {
          description,
          totalPrice,
          clientId: String(clientId),
          orderItems: {
            create: products.map((p) => ({
              productId: String(p.id),
              quantity: p.quantity,
            })),
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  // READ (All Orders for a Client)
  async getOrdersByClient(id) {
    console.log("got to repository");
    return prisma.order.findMany({
      where: { clientId: id },
    });
  }

  // READ
  // async getOrderById(id) {
  //   console.log("Got to repository");
  //   return prisma.order.findUnique({ where: { id } });
  // }
  async getOrderById(id) {
    console.log("got to repository");
    return prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });
  }

  // UPDATE Payment Status
  async updatePaymentStatus(orderId, newStatus) {
    console.log("Update order repository");
    console.log(orderId);
    return prisma.order.update({
      where: { id: new ObjectId(orderId) },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });
  }

  async handlePaymentConfirmed(orderId, items) {
    console.log("Going for stock");
    await productApi.deductStock(items);
  }
}

export default new OrderRepository();
