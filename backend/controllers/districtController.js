
import District from "../models/District.js";


export const getDistricts = async (req, res) => {
  try {
    const districts = await District.find();
    res.json({ districts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching districts", error: error.message });
  }
};


export const createDistrict = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "District name is required" });
    }

    const existingDistrict = await District.findOne({ name });
    if (existingDistrict) {
      return res.status(400).json({ message: "District already exists" });
    }

    const newDistrict = await District.create({ name });
    res.status(201).json({ message: "District created", district: newDistrict });
  } catch (error) {
    res.status(500).json({ message: "Error creating district", error: error.message });
  }
};


export const updateDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "District name is required" });
    }

    const updatedDistrict = await District.findByIdAndUpdate(
      districtId,
      { name },
      { new: true }
    );

    if (!updatedDistrict) {
      return res.status(404).json({ message: "District not found" });
    }

    res.json({ message: "District updated", district: updatedDistrict });
  } catch (error) {
    res.status(500).json({ message: "Error updating district", error: error.message });
  }
};


export const deleteDistrict = async (req, res) => {
  try {
    const { districtId } = req.params;

    const deletedDistrict = await District.findByIdAndDelete(districtId);

    if (!deletedDistrict) {
      return res.status(404).json({ message: "District not found" });
    }

    res.json({ message: "District deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting district", error: error.message });
  }
};
