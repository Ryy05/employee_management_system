
import DA from "../models/DA.js";
import PayCommission from "../models/PayCommission.js";

export const getDARecords = async (req, res) => {
  try {
    const daRecords = await DA.find().populate("payCommission", "commissionName effectiveFrom");
    res.json({ daRecords });
  } catch (error) {
    res.status(500).json({ message: "Error fetching DA records", error: error.message });
  }
};


export const createDA = async (req, res) => {
  try {
    const { payCommission, daPercentage, effectiveDate } = req.body;
    const payCommissionRecord = await PayCommission.findById(payCommission);
    if (!payCommissionRecord) {
      return res.status(400).json({ message: "Invalid Pay Commission ID" });
    }

    const newDA = await DA.create({ payCommission, daPercentage, effectiveDate });
    res.status(201).json({ message: "DA record created successfully", newDA });
  } catch (error) {
    res.status(500).json({ message: "Error creating DA record", error: error.message });
  }
};


export const getDAById = async (req, res) => {
  try {
    const daRecord = await DA.findById(req.params.id).populate("payCommission", "commissionName effectiveFrom");

    if (!daRecord) {
      return res.status(404).json({ message: "DA record not found" });
    }

    res.json({ daRecord });
  } catch (error) {
    res.status(500).json({ message: "Error fetching DA record", error: error.message });
  }
};


export const updateDA = async (req, res) => {
  try {
    const { payCommission, daPercentage, effectiveDate } = req.body;

    const daRecord = await DA.findById(req.params.id);
    if (!daRecord) {
      return res.status(404).json({ message: "DA record not found" });
    }

    if (payCommission) {
      const payCommissionRecord = await PayCommission.findById(payCommission);
      if (!payCommissionRecord) {
        return res.status(400).json({ message: "Invalid Pay Commission ID" });
      }
      daRecord.payCommission = payCommission;
    }

    if (daPercentage !== undefined) daRecord.daPercentage = daPercentage;
    if (effectiveDate) daRecord.effectiveDate = effectiveDate;

    await daRecord.save();

    res.json({ message: "DA record updated successfully", daRecord });
  } catch (error) {
    res.status(500).json({ message: "Error updating DA record", error: error.message });
  }
};


export const deleteDA = async (req, res) => {
  try {
    const daRecord = await DA.findByIdAndDelete(req.params.id);

    if (!daRecord) {
      return res.status(404).json({ message: "DA record not found" });
    }

    res.json({ message: "DA record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting DA record", error: error.message });
  }
};
