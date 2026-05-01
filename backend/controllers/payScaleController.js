
import PayScale from "../models/PayScale.js";
import PayCommission from "../models/PayCommission.js";
export const getPayScales = async (req, res) => {
  try {
    const { payCommissionId } = req.query;

    let query = {};
    if (payCommissionId) {
      query.payCommission = payCommissionId;
    }

    const payScales = await PayScale.find(query)
      .populate("payCommission", "commissionName effectiveFrom")
      .exec();

    res.json({ payScales });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pay scales", error: error.message });
  }
};

export const createPayScale = async (req, res) => {
  try {
    const { payCommission, payLevelCode, scaleRange } = req.body;

    const commissionExists = await PayCommission.findById(payCommission);
    if (!commissionExists) {
      return res.status(400).json({ message: "Invalid Pay Commission ID" });
    }

    const payScale = new PayScale({
      payCommission,
      payLevelCode,
      scaleRange,
    });

    await payScale.save();

    res.status(201).json({ message: "Pay scale created successfully", payScale });
  } catch (error) {
    res.status(500).json({ message: "Error creating pay scale", error: error.message });
  }
};


export const getPayScaleById = async (req, res) => {
  try {
    const payScale = await PayScale.findById(req.params.id).populate("payCommission");
    if (!payScale) {
      return res.status(404).json({ message: "Pay scale not found" });
    }
    res.json({ payScale });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pay scale", error: error.message });
  }
};


export const updatePayScale = async (req, res) => {
  try {
    const { payCommission, payLevelCode, scaleRange } = req.body;

    const payScale = await PayScale.findByIdAndUpdate(
      req.params.id,
      { payCommission, payLevelCode, scaleRange },
      { new: true }
    );

    if (!payScale) {
      return res.status(404).json({ message: "Pay scale not found" });
    }

    res.json({ message: "Pay scale updated successfully", payScale });
  } catch (error) {
    res.status(500).json({ message: "Error updating pay scale", error: error.message });
  }
};


export const deletePayScale = async (req, res) => {
  try {
    const payScale = await PayScale.findByIdAndDelete(req.params.id);

    if (!payScale) {
      return res.status(404).json({ message: "Pay scale not found" });
    }

    res.json({ message: "Pay scale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pay scale", error: error.message });
  }
};
