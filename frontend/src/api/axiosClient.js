import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 404 &&
      error.response.data?.message === "No zones found for the given district."
    ) {
      const customError = new Error("No zones found for the given district.");
      customError.isHandled = true;
      customError.response = error.response;
      return Promise.reject(customError);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.message === "Invalid credentials"
    ) {
      const authError = new Error("Invalid credentials. Please try again.");
      authError.isHandled = true;
      authError.response = error.response;
      return Promise.reject(authError);
    }

    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    return Promise.reject(new Error("Something went wrong. Please try again later."));
  }
);

export default axiosClient;
