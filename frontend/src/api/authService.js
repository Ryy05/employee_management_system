import axiosClient from "./axiosClient";

export const loginUser = async (credentials) => {
  try {
    const response = await axiosClient.post("/auth/login", credentials);
    console.log("Response Data from Backend:", response.data); // ✅ Log the entire response data
    return response.data;
  } catch (error) {
    console.error("Error during login:", error.response ? error.response.data : error.message);
    throw error;
  }
};
