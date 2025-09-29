import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class ClientRepository {
  // CREATE
  async createClient(clientData) {
    const { firstName, email } = clientData;

    if (!firstName || !email) {
      throw new Error("Client first name and email are required.");
    }

    return prisma.eClient.create({
      data: clientData,
    });
  }

  // READ (All)
  async getAllClients() {
    return prisma.eClient.findMany();
  }

  // READ
  async getClientById(id) {
    return prisma.eClient.findUnique({
      where: { id: parseInt(id) },
    });
  }

  // UPDATE
  async updateClient(id, updateData) {
    return prisma.eClient.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
  }

  // DELETE
  async deleteClient(id) {
    return prisma.eClient.delete({
      where: { id: parseInt(id) },
    });
  }
}

export default new ClientRepository();
