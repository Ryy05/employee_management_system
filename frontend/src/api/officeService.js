// officeService.js
import axiosClient from './axiosClient';

// Fetch all offices
export const getAllOffices = async () => {
  const response = await axiosClient.get('/offices');
  return response.data;
};

// Fetch a specific office by ID
export const getOfficeById = async (officeId) => {
  const response = await axiosClient.get(`/offices/${officeId}`);
  return response.data;
};

// Create a new office
export const createOffice = async (officeData) => {
  const response = await axiosClient.post('/offices', officeData);
  return response.data;
};

// Update an existing office
export const updateOffice = async ({ officeId, officeData }) => {
  const response = await axiosClient.put(`/offices/${officeId}`, officeData);
  return response.data;
};

// Delete an office
export const deleteOffice = async (officeId) => {
  const response = await axiosClient.delete(`/offices/${officeId}`);
  return response.data;
};
