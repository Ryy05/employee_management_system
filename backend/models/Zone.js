import mongoose from "mongoose";

const ZoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    district: { type: mongoose.Schema.Types.ObjectId, ref: "District", required: true },
    offices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Office" }],
    myOffice: { type: mongoose.Schema.Types.ObjectId, ref: "Office" }
  },
  { timestamps: true }
);

export default mongoose.models.Zone || mongoose.model("Zone", ZoneSchema);
