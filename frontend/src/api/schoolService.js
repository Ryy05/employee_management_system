// src/api/schoolService.js
import axiosClient from "./axiosClient";

// Get all schools (for main admin)
export const getAllSchools = async () => {
  const res = await axiosClient.get("/schools");
  return res.data; // returns an array of school objects (with employees populated)
};

// Get my school (for school admin)
export const getMySchool = async () => {
  const res = await axiosClient.get("/schools/mine");
  return res.data; // returns a single school object
};

// Get school by ID (for main admin)
export const getSchoolById = async (id) => {
  const res = await axiosClient.get(`/schools/${id}`);
  return res.data;
};

// Get school status (zones with their schools)
export const getSchoolStatus = async () => {
  const res = await axiosClient.get("/schools/status");
  // Expecting res.data to have a 'zones' property
  return res.data.zones;
};

export const updateSchool = async (id, schoolData) => {
  const res = await axiosClient.put(`/schools/${id}`, schoolData);
  return res.data;
};