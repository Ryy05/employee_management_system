
import TransferRemark from "../models/TransferRemark.js";

export const createTransferRemark = async (req, res) => {
  try {
    const newRemark = await TransferRemark.create({
      ...req.body,
      addedBy: req.user.userId,  
    });

    res.status(201).json({ message: "Transfer remark added", remark: newRemark });
  } catch (error) {
    res.status(500).json({ message: "Error adding transfer remark", error: error.message });
  }
};


export const getTransferRemarks = async (req, res) => {
  try {
    const remarks = await TransferRemark.find({ transferRequest: req.params.transferRequestId })
      .populate("addedBy", "userName role")
      .sort({ createdAt: -1 }); 

    res.json({ remarks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transfer remarks", error: error.message });
  }
};
