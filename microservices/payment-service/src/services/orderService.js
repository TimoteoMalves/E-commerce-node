// /src/services/PaymentService.js
import PaymentRepository from "../repositories/PaymentRepository.js"; // Ainda é usado
import axios from "axios";

const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://order-service:3000";

class PaymentService {
  /**
   * ÚNICA FUNÇÃO DE ORQUESTRAÇÃO EXTERNA.
   * Ela realiza: 1. Atualização do DB (Chamando Repository) e 2. Chamada Externa (axios).
   */
  async processConfirmationAndNotifyOrder(id, status) {
    if (!status || typeof status !== "string") {
      throw new Error(
        "O campo 'status' é obrigatório e deve ser uma string válida."
      );
    }

    // 1. Orquestração Interna: Atualiza o status no DB do Payment Service (via Repository)
    let updatedTransaction = await PaymentRepository.updateStatusInDB(
      id,
      status
    );

    if (!updatedTransaction) {
      return null;
    }

    // 2. Orquestração Externa: Notificar o Order Service (Chamada API Síncrona)
    if (status === "PAID") {
      await this.notifyOrderService(updatedTransaction.orderId, status);
    }

    return updatedTransaction;
  }

  /**
   * Função auxiliar de comunicação HTTP.
   */
  async notifyOrderService(orderId, status) {
    try {
      console.log(
        `[Payment Service] Notificando Order Service da ordem ${orderId} sobre o status: ${status}`
      );

      await axios.put(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
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

export default new PaymentService();
