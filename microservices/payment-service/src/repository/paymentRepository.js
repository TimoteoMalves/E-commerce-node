// /src/repositories/PaymentRepository.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PaymentRepository {
  async createTransaction(paymentData) {
    return prisma.payment.create({
      data: {
        ...paymentData,
        status: "AWAITING_PAYMENT",
      },
    });
  }

  async updateStatusInDB(id, newStatus) {
    try {
      return prisma.payment.update({
        where: { id: parseInt(id) },
        data: {
          status: newStatus,
          paidAt: newStatus === "PAID" ? new Date() : undefined,
        },
      });
    } catch (error) {
      if (error.code === "P2025") {
        return null;
      }
      throw error;
    }
  }

  async getById(id) {
    return prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: {
        paymentType: {
          select: { displayName: true, name: true },
        },
      },
    });
  }
}

export default new PaymentRepository();
