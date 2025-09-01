import axios from "axios";

const api = axios.create({
  baseURL: "/api", // nginx proxies /api → backend
});

export default api;
