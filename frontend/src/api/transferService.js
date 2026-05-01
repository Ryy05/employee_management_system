import axiosClient from "./axiosClient";


export const createTransferRequest = async (transferData, user) => {
  const response = await axiosClient.post("/transfers", transferData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data.transferRequest; 
};


export const getTransferRequests = async () => {
  const response = await axiosClient.get("/transfers", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data; 
};


export const respondToTransferRequest = async (requestId, action, reason) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const response = await axiosClient.put(
      `/transfers/${requestId}/respond`, 
      { action, reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.transferRequest; 
  } catch (error) {
    console.error("Error responding to transfer request:", error);
    throw new Error(error.response?.data?.message || error.message || "Something went wrong.");
  }
};



export const approveTransferRequest = async (requestId, action, remarkText) => {
  const response = await axiosClient.put(
    `/transfers/${requestId}/approve`,
    { action, remarkText },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data.transferRequest; // Adjust based on your backend's response
};
