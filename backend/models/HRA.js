import mongoose from "mongoose";

const HRASchema = new mongoose.Schema({
  hraType: { type: String, required: true, unique: true },//
  hraPercentage: { type: Number },
  effectiveDate: { type: Date }
}, { timestamps: true });

export default mongoose.models.HRA || mongoose.model("HRA", HRASchema);
