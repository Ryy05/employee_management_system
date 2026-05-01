import mongoose from "mongoose";

const OfficeSchema = new mongoose.Schema({
  officeName: { type: String, required: true },
  officeType: { type: String, required: true, enum: ['Administrative', 'Educational'] },
  isDdo: { type: Boolean, default: false },
  ddoOfficerId: { type: String },
  ddoCode: { type: String, unique: true, sparse: true },
  parentOffice: { type: mongoose.Schema.Types.ObjectId, ref: "Office" },
  contact: { type: String },
  address: { type: String },
}, { timestamps : true });

export default mongoose.models.Office || mongoose.model("Office", OfficeSchema);

