import PaymentService from "../services/PaymentService.js";
import PaymentRepository from "../repositories/PaymentRepository.js";

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
      const { id } = req.params;
      const transaction = await PaymentRepository.getById(parseInt(id));
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

      // Chama o Service, pois esta operação envolve LÓGICA EXTERNA (notificar Order Service).
      const updatedTransaction =
        await PaymentService.processConfirmationAndNotifyOrder(
          parseInt(id),
          status
        );

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
