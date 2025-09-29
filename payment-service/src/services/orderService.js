import axios from "axios";

const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://order-service:3003";

class OrderService {
  // async processConfirmationAndNotifyOrder(id, status) {
  //   if (!status || typeof status !== "string") {
  //     throw new Error(
  //       "O campo 'status' é obrigatório e deve ser uma string válida."
  //     );
  //   }
  //   let updatedTransaction = await PaymentRepository.updateStatusInDB(
  //     id,
  //     status
  //   );

  //   if (!updatedTransaction) {
  //     return null;
  //   }

  //   // 2. Orquestração Externa: Notificar o Order Service (Chamada API Síncrona)
  //   if (status === "PAID") {
  //     await this.notifyOrderService(updatedTransaction.orderId, status);
  //   }

  //   return updatedTransaction;
  // }

  async notifyOrderService(orderId, status) {
    try {
      console.log(
        `[Payment Service] Notificando Order Service da ordem ${orderId} sobre o status: ${status}`
      );

      await axios.patch(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
        status: status,
      });
    } catch (error) {
      console.error(
        `[Payment Service] FALHA ao notificar Order Service para a ordem ${orderId}.`
      );
      throw new Error(
        `Payment successful, but failed to notify Order Service: ${error.message}`
      );
    }
  }

  // Não há mais funções como initiatePayment ou getPayment, pois o Controller as chamará DIRETAMENTE no Repository.
}

export default new OrderService();
