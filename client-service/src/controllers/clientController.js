import ClientRepository from "../repository/client.repository.js";

class ClientController {
  // POST /clients
  async create(req, res) {
    try {
      const client = await ClientRepository.createClient(req.body);
      return res.status(200).json(client);
    } catch (error) {
      return res.status(406).json({ message: error });
    }
  }

  // GET /clients/:id
  async getById(req, res) {
    try {
      const client = await ClientRepository.getClientById(req.params.id);
      return res.status(200).json(client);
    } catch (error) {
      return res.status(406).json({ message: error });
    }
  }

  async fetchAllClients(req, res) {
    try {
      const clients = await ClientRepository.getAllClients();
      console.log("got back here");
      if (!clients) {
        res.status(400).json({ message: "No clients were found" });
      }
      console.log("here again");
      res.status(200).json(clients);
    } catch (error) {
      res.status(406).json({ message: error });
    }
  }

  // PUT /clients/:id
  async update(req, res) {
    try {
      const updatedClient = await ClientRepository.updateClient(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedClient);
    } catch (error) {
      res.status(406).json({ error: error.message });
    }
  }
}

export default new ClientController();
