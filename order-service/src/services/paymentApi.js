import axios from "axios";

// Variável de ambiente para a URL do Payment Service
const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL || "http://payment-service:3004";

export async function createTransaction(orderId, amount, paymentTypeId = 1) {
  console.log(`[PaymentApi] POST ${PAYMENT_SERVICE_URL}/payments`);

  const paymentPayload = {
    orderId: orderId,
    amount: amount,
    paymentTypeId: paymentTypeId,
  };

  try {
    const response = await axios.post(
      `${PAYMENT_SERVICE_URL}/payments`,
      paymentPayload
    );

    return response.data;
  } catch (error) {
    console.error(`[PaymentApi] ERRO - Criar pagamento: ${error.message}`);
    // Relança o erro com uma mensagem útil para o Order Service tratar
    throw new Error(
      `Failed to initiate payment: ${
        error.response?.data?.message || "Gateway connection error."
      }`
    );
  }
}
