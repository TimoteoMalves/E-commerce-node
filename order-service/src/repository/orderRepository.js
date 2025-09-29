import { PrismaClient } from "@prisma/client";
import ProductApi from "../services/productApi.js";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();
const productApi = new ProductApi();

class OrderRepository {
  // CREATE
  // async createOrder(clientId, products, description) {
  //   if (!products || products.length === 0) {
  //     throw new Error("Cannot create an order without products.");
  //   }

  //   console.log(products);

  //   const productIds = products.map((p) => parseInt(p.id));

  //   console.log(productIds);

  //   const validProductIds = productIds.filter(
  //     (id) => !isNaN(id) && id !== null
  //   );

  //   if (validProductIds.length === 0) {
  //     throw new Error("No valid product IDs provided for the order.");
  //   }
  //   const productRecords = await prisma.product.findMany({
  //     where: { id: { in: validProductIds } },
  //   });

  //   if (productRecords.length !== productIds.length) {
  //     throw new Error("One or more products were not found.");
  //   }

  //   let totalPrice = 0;
  //   const orderItemsData = products.map((item) => {
  //     const product = productRecords.find((p) => p.id === parseInt(item.id));
  //     const itemQuantity = parseInt(item.quantity);

  //     console.log(`Product.stock: ${product.stock}`);
  //     console.log(`Item.quantity: ${itemQuantity}`);

  //     if (!product || product.stock < itemQuantity) {
  //       // FIX 1: Use the correct property 'item.id' for error message
  //       throw new Error(`Insufficient stock for product ID ${item.id}.`);
  //     }

  //     totalPrice += product.price * itemQuantity;

  //     // FIX 2: Map JSON 'item.id' to DB 'productId' and use parsed 'itemQuantity'
  //     return { productId: parseInt(item.id), quantity: itemQuantity };
  //   });

  //   const newOrder = await prisma.order.create({
  //     data: {
  //       clientId: parseInt(clientId),
  //       description: description,
  //       totalPrice: totalPrice,
  //       status: "PENDING", // Default
  //       orderItems: {
  //         createMany: {
  //           data: orderItemsData, // This array is now correctly structured
  //         },
  //       },
  //     },
  //   });

  //   return newOrder;
  // }

  async createOrder(description, totalPrice, clientId, products) {
    try {
      console.log(`Create dentro do repository`);

      for (const product of products) {
        try {
          console.log(`Product id ${product.id}`);
          console.log(`Product id ${product}`);
          const response = await productApi.getProduct(product.id);

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
