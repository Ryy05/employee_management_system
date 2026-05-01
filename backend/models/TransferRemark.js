import mongoose from "mongoose";

const TransferRemarkSchema = new mongoose.Schema({
  transfer: { type: mongoose.Schema.Types.ObjectId, ref: "TransferRequest", required: true },
  remarkType: { type: String, required: true, enum: ['CEOApproval', 'SchoolAdminApproval', 'Rejection', 'RequestCreation'] },
  remarkText: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  addedDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.TransferRemark || mongoose.model("TransferRemark", TransferRemarkSchema);
