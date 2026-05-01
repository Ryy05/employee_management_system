
import HRA from "../models/HRA.js";

export const getHRARecords = async (req, res) => {
  try {
    const hraRecords = await HRA.find();
    res.json({ hraRecords });
  } catch (error) {
    res.status(500).json({ message: "Error fetching HRA records", error: error.message });
  }
};


export const createHRA = async (req, res) => {
  try {
    const { hraType, hraPercentage, effectiveDate } = req.body;
    const existingHRA = await HRA.findOne({ hraType });
    if (existingHRA) {
      return res.status(400).json({ message: "HRA type already exists. Please provide a unique HRA type." });
    }

    const newHRA = await HRA.create({ hraType, hraPercentage, effectiveDate });
    res.status(201).json({ message: "HRA record created successfully", hra: newHRA });
  } catch (error) {
    res.status(500).json({ message: "Error creating HRA record", error: error.message });
  }
};


export const getHRAById = async (req, res) => {
  try {
    const hraRecord = await HRA.findById(req.params.id);

    if (!hraRecord) {
      return res.status(404).json({ message: "HRA record not found" });
    }

    res.json({ hraRecord });
  } catch (error) {
    res.status(500).json({ message: "Error fetching HRA record", error: error.message });
  }
};


export const updateHRA = async (req, res) => {
  try {
    const { hraType, hraPercentage, effectiveDate } = req.body;

    const hraRecord = await HRA.findById(req.params.id);
    if (!hraRecord) {
      return res.status(404).json({ message: "HRA record not found" });
    }

    if (hraType) hraRecord.hraType = hraType;
    if (hraPercentage !== undefined) hraRecord.hraPercentage = hraPercentage;
    if (effectiveDate) hraRecord.effectiveDate = effectiveDate;

    await hraRecord.save();

    res.json({ message: "HRA record updated successfully", hraRecord });
  } catch (error) {
    res.status(500).json({ message: "Error updating HRA record", error: error.message });
  }
};


export const deleteHRA = async (req, res) => {
  try {
    const hraRecord = await HRA.findByIdAndDelete(req.params.id);

    if (!hraRecord) {
      return res.status(404).json({ message: "HRA record not found" });
    }

    res.json({ message: "HRA record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting HRA record", error: error.message });
  }
};
