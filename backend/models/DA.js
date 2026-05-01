import mongoose from "mongoose";

const DASchema = new mongoose.Schema({
  payCommission: { type: mongoose.Schema.Types.ObjectId, ref: "PayCommission", required: true },
  daPercentage: { type: Number },
  effectiveDate: { type: Date }
}, { timestamps: true });

export default mongoose.models.DA || mongoose.model("DA", DASchema);
