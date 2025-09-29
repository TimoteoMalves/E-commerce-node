import paymentRepository from "../repository/paymentRepository.js";
import PaymentRepository from "../repository/paymentRepository.js";
import orderService from "../services/orderService.js";

class PaymentController {
  async create(req, res) {
    try {
      const newTransaction = await PaymentRepository.createTransaction(
        req.body
      );
      res.status(201).json(newTransaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      console.log(req.params.id);
      const transaction = await PaymentRepository.getById(req.params.id);
      if (transaction) {
        res.json(transaction);
      } else {
        res.status(404).json({ message: "Transaction not found." });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching transaction." });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // const updatedTransaction =
      //   await orderService.processConfirmationAndNotifyOrder(id, status);

      const updatedTransaction = await paymentRepository.updateStatusInDB(
        id,
        status
      );

      console.log(`[Payment Service] -  Transaction ${id} updated`);

      const orderId = updatedTransaction.orderId;
      console.log(`OrderID ${orderId}`);

      try {
        await orderService.notifyOrderService(orderId, status);
      } catch (error) {
        console.log(`[Payment Service] Api call error:  ${error}`);
      }

      if (updatedTransaction) {
        res.status(200).json(updatedTransaction);
      } else {
        res.status(404).json({ message: "Transaction not found." });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new PaymentController();
