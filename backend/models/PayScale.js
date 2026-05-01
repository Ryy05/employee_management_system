import mongoose from "mongoose";

const PayScaleSchema = new mongoose.Schema({
  payCommission: { type: mongoose.Schema.Types.ObjectId, ref: "PayCommission", required: true },
  payScaleAndLevel: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.PayScale || mongoose.model("PayScale", PayScaleSchema);
