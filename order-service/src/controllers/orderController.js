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
  async getOrdersByClient(id) {
    console.log("Got to controller");
    try {
      const orders = await orderRepository.getOrdersByClient(id);
      return orders;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getOrderById(id) {
    console.log("Got to order controller");
    console.log(`O Id: ${id}`);
    return orderRepository.getOrderById(id);
  }

  // PATCH /orders/:id/status
  async updateStatus(req, res) {
    console.log("Update order controller");
    const orderId = req.params.id;
    console.log(orderId);
    try {
      const { newStatus } = req.body;
      const updatedOrder = await orderRepository.updatePaymentStatus(
        String(orderId),
        newStatus
      );

      console.log(`Order updated: ${updatedOrder}`);

      const orderWithItems = await orderRepository.getOrderById(orderId);
      console.log("Order with items:", orderWithItems);

      if (newStatus === "PAID" && orderWithItems?.orderItems) {
        await orderRepository.handlePaymentConfirmed(
          orderId,
          orderWithItems.orderItems
        );
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new OrderController();
