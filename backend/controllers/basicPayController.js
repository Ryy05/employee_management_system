
import BasicPay from "../models/BasicPay.js";
import PayScale from "../models/PayScale.js";


export const getBasicPays = async (req, res) => {
  try {
    const { payScaleId } = req.query;

    let query = {};
    if (payScaleId) {
      query.payScale = payScaleId;
    }

    const basicPays = await BasicPay.find(query)
      .populate("payScale", "payLevelCode scaleRange")
      .exec();

    res.json({ basicPays });
  } catch (error) {
    res.status(500).json({ message: "Error fetching basic pays", error: error.message });
  }
};

export const createBasicPay = async (req, res) => {
  try {
    const { payScale, amount } = req.body;
    const payScaleExists = await PayScale.findById(payScale);
    if (!payScaleExists) {
      return res.status(400).json({ message: "Invalid Pay Scale ID" });
    }

    const basicPay = new BasicPay({
      payScale,
      amount,
    });

    await basicPay.save();

    res.status(201).json({ message: "Basic pay created successfully", basicPay });
  } catch (error) {
    res.status(500).json({ message: "Error creating basic pay", error: error.message });
  }
};


export const getBasicPayById = async (req, res) => {
  try {
    const basicPay = await BasicPay.findById(req.params.id).populate("payScale");
    if (!basicPay) {
      return res.status(404).json({ message: "Basic pay not found" });
    }
    res.json({ basicPay });
  } catch (error) {
    res.status(500).json({ message: "Error fetching basic pay", error: error.message });
  }
};


export const updateBasicPay = async (req, res) => {
  try {
    const { payScale, amount } = req.body;

    const basicPay = await BasicPay.findByIdAndUpdate(
      req.params.id,
      { payScale, amount },
      { new: true }
    );

    if (!basicPay) {
      return res.status(404).json({ message: "Basic pay not found" });
    }

    res.json({ message: "Basic pay updated successfully", basicPay });
  } catch (error) {
    res.status(500).json({ message: "Error updating basic pay", error: error.message });
  }
};


export const deleteBasicPay = async (req, res) => {
  try {
    const basicPay = await BasicPay.findByIdAndDelete(req.params.id);

    if (!basicPay) {
      return res.status(404).json({ message: "Basic pay not found" });
    }

    res.json({ message: "Basic pay deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting basic pay", error: error.message });
  }
};

