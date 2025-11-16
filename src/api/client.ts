import axios from "axios";
import useAuthStore from "../store/auth";

const API_URL = "https://to-do-b-o1-0.onrender.com/api";

const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
