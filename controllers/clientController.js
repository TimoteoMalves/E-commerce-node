import ClientService from "../services/client.service.js";

class ClientController {
  // POST /clients
  async create(req, res) {
    try {
      const client = await ClientService.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /clients/:id
  async getById(req, res) {
    try {
      const client = await ClientService.getClientById(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found." });
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch client." });
    }
  }

  // PUT /clients/:id
  async update(req, res) {
    try {
      const updatedClient = await ClientService.updateClient(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedClient);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new ClientController();
