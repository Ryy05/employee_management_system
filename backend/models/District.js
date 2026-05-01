import mongoose from "mongoose";

const DistrictSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    zones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Zone" }]
  },
  { timestamps: true }
);

export default mongoose.models.District || mongoose.model("District", DistrictSchema);
