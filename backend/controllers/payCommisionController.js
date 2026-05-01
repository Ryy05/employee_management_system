import PayCommission from "../models/PayCommission.js";

export const getPayCommissions = async (req, res) => {
  try {
    const commissions = await PayCommission.find();
    res.json({ commissions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pay commissions", error: error.message });
  }
};


export const createPayCommission = async (req, res) => {
  try {
    const { commissionName, effectiveFrom } = req.body;
    const existingCommission = await PayCommission.findOne({ commissionName });
    if (existingCommission) {
      return res.status(400).json({ message: "Commission name already exists" });
    }

    const commission = await PayCommission.create({
      commissionName,
      effectiveFrom,
    });

    res.status(201).json({ message: "Pay commission created successfully", commission });
  } catch (error) {
    res.status(500).json({ message: "Error creating pay commission", error: error.message });
  }
};


export const updatePayCommission = async (req, res) => {
  try {
    const { commissionName, effectiveFrom } = req.body;

    const updatedCommission = await PayCommission.findByIdAndUpdate(
      req.params.id,
      { commissionName, effectiveFrom },
      { new: true }
    );

    if (!updatedCommission) {
      return res.status(404).json({ message: "Pay commission not found" });
    }

    res.json({ message: "Pay commission updated successfully", updatedCommission });
  } catch (error) {
    res.status(500).json({ message: "Error updating pay commission", error: error.message });
  }
};


export const deletePayCommission = async (req, res) => {
  try {
    const deletedCommission = await PayCommission.findByIdAndDelete(req.params.id);

    if (!deletedCommission) {
      return res.status(404).json({ message: "Pay commission not found" });
    }

    res.json({ message: "Pay commission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pay commission", error: error.message });
  }
};
