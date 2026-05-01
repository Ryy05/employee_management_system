import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema(
  {
    udiseId: { type: String, required: true, unique: true },
    principal: { type: String },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", default: null },
    office: { type: mongoose.Schema.Types.ObjectId, ref: "Office", default: null },
    isPMShiriSchool: { type: Boolean, default: false },
    feasibilityZone: { type: String, required: true },
    scheme: { type: String },
    subScheme: { type: String },
    dateOfUpgrade: { type: Date },
    dateOfEstablishment: { type: Date },
    numberOfStudents: { type: Number },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.School || mongoose.model("School", SchoolSchema);
