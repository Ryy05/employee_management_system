import mongoose from "mongoose";

const PayCommissionSchema = new mongoose.Schema({
  commissionName: { type: String, required: true, unique: true },
  effectiveFrom: { type: Date }
}, { timestamps: true });

export default mongoose.models.PayCommission || mongoose.model("PayCommission", PayCommissionSchema);
