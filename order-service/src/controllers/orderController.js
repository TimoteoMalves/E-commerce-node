import orderRepository from "../repository/orderRepository.js";
import { createTransaction } from "../services/paymentApi.js";

class OrderController {
  // POST /orders
  async create(req, res) {
    try {
      const { description, totalPrice, clientId, products } = req.body;
      const order = await orderRepository.createOrder(
        description,
        totalPrice,
        clientId,
        products
      );

      const orderId = order.id;
      console.log("Creating payment transaction");
      const payment = await createTransaction(orderId, order.totalPrice);

      res
        .status(201)
        .json(
          `[Order service] - Order ${orderId} and Paayment transaction ${payment.id} created`
        );
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /clients/:id/orders - Required Method
  async getOrdersByClient(req, res) {
    console.log("Get order controller");
    const { id } = req.params;
    console.log(id);
    try {
      const orders = await orderRepository.getOrdersByClient(id);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch client orders." });
    }
  }

  // PATCH /orders/:id/status
  async updateStatus(req, res) {
    console.log("Update order controller");
    try {
      const { newStatus } = req.body;
      const updatedOrder = await orderRepository.updatePaymentStatus(
        req.params.id,
        newStatus
      );

      if (newStatus == "PAID") {
        try {
          await orderRepository.handlePaymentConfirmed(updatedOrder);
        } catch (erro) {
          res.status(400).json(orders);
        }
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new OrderController();
