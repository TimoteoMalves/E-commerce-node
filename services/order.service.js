// OrderService.js (FIXED)

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class OrderService {
  // CREATE
  async createOrder(clientId, products, description) {
    if (!products || products.length === 0) {
      throw new Error("Cannot create an order without products.");
    }

    console.log(products);

    // 1. Extraction and Parsing: Use 'p.id' from JSON, convert to integer.
    const productIds = products.map((p) => parseInt(p.id));

    console.log(productIds);

    const validProductIds = productIds.filter(
      (id) => !isNaN(id) && id !== null
    );

    if (validProductIds.length === 0) {
      throw new Error("No valid product IDs provided for the order.");
    }

    // NOTE: Using validProductIds in the query is safer than productIds
    const productRecords = await prisma.product.findMany({
      where: { id: { in: validProductIds } },
    });

    if (productRecords.length !== productIds.length) {
      throw new Error("One or more products were not found.");
    }

    let totalPrice = 0;
    const orderItemsData = products.map((item) => {
      // Find the product record using the ID from the JSON (item.id),
      // but convert it to an integer first for a strict comparison with p.id (which is an integer).
      const product = productRecords.find((p) => p.id === parseInt(item.id));

      // Ensure item.quantity is treated as an integer for stock check and calculation
      const itemQuantity = parseInt(item.quantity);

      console.log(`Product.stock: ${product.stock}`);
      console.log(`Item.quantity: ${itemQuantity}`);

      if (!product || product.stock < itemQuantity) {
        // FIX 1: Use the correct property 'item.id' for error message
        throw new Error(`Insufficient stock for product ID ${item.id}.`);
      }

      totalPrice += product.price * itemQuantity;

      // FIX 2: Map JSON 'item.id' to DB 'productId' and use parsed 'itemQuantity'
      return { productId: parseInt(item.id), quantity: itemQuantity };
    });

    const newOrder = await prisma.order.create({
      data: {
        clientId: parseInt(clientId),
        description: description,
        totalPrice: totalPrice,
        status: "PENDING", // Default
        orderItems: {
          createMany: {
            data: orderItemsData, // This array is now correctly structured
          },
        },
      },
    });

    return newOrder;
  }

  // READ (All Orders for a Client)
  async getOrdersByClient(clientId) {
    return prisma.order.findMany({
      where: {
        clientId: parseInt(clientId),
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // UPDATE Payment Status
  async updatePaymentStatus(orderId, newStatus) {
    // NOTE: This validation assumes prisma.PaymentStatus is accessible or defined elsewhere.
    // For the purposes of fixing the order creation, we'll leave this as-is.
    if (!Object.keys(prisma.PaymentStatus).includes(newStatus)) {
      throw new Error(`Invalid payment status: ${newStatus}`);
    }

    return prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });
  }
}

export default new OrderService();
