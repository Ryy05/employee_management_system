
import mongoose from "mongoose";

const TransferRequestSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    fromOffice: { type: mongoose.Schema.Types.ObjectId, ref: "Office", required: true },
    toOffice: { type: mongoose.Schema.Types.ObjectId, ref: "Office", required: true },
    transferDate: { type: Date, required: true },
    transferType: { type: String, required: true, enum: ['Transfer', 'Deputation', 'Attachment'] },
    transferReason: { type: String },
    status: { type: String, required: true, default: "Pending" },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvalDate: { type: Date },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    acceptanceDate: { type: Date },
    transferOrderNo: { type: String },
    transferOrderDate: { type: Date },
    transferOrder: { type: String },
}, { timestamps: true });

export default mongoose.models.TransferRequest ||
  mongoose.model("TransferRequest", TransferRequestSchema);
