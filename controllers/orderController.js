import OrderService from "../services/order.service.js";

class OrderController {
  // POST /orders
  async create(req, res) {
    try {
      const { clientId, products, description } = req.body;
      const order = await OrderService.createOrder(
        clientId,
        products,
        description
      );
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /clients/:clientId/orders - Required Method
  async getOrdersByClient(req, res) {
    try {
      const orders = await OrderService.getOrdersByClient(req.params.clientId);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch client orders." });
    }
  }

  // PATCH /orders/:id/status
  async updateStatus(req, res) {
    try {
      const { newStatus } = req.body; // Expects a status like 'PAID' or 'FAILED'
      const updatedOrder = await OrderService.updatePaymentStatus(
        req.params.id,
        newStatus
      );
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // ... other methods like getOrderById
}

export default OrderController;
