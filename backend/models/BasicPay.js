import mongoose from "mongoose";

const BasicPaySchema = new mongoose.Schema({
  payScale: { type: mongoose.Schema.Types.ObjectId, ref: "PayScale", required: true },
  amount: { type: mongoose.Schema.Types.Decimal128, required: true }
}, { timestamps: true });

export default mongoose.models.BasicPay || mongoose.model("BasicPay", BasicPaySchema);
