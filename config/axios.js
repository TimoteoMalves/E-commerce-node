import axios from "axios";

const api = axios.create({
  baseURL: process.env.ORDER_API_URL || "http://localhost:3003",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default new api();
