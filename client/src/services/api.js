import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL;

console.log("VITE_API_URL:", apiBaseUrl);

const api = axios.create({
  baseURL: apiBaseUrl,
});

export default api;