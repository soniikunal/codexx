import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Prefixes all requests with /api
  headers: {
    "Content-Type": "application/json",
  },
  // You can also add interceptors here if needed
});

export default axiosInstance;
