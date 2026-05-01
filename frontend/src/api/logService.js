import axiosClient from "./axiosClient";
export const getRecentActivities = async () => {
    const response = await axiosClient.get("/logs");
    // Assume logs are sorted descending by createdAt; if not, sort them here.
    // Here we return the top 3 logs.
    return response.data.logs.slice(0, 3);
  };