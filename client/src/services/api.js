import axios from "axios";

const api = axios.create({
  baseURL: "https://capstone-project-final.onrender.com/api",
});

export default api;