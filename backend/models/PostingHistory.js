import mongoose from "mongoose";

const PostingHistorySchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    office: { type: mongoose.Schema.Types.ObjectId, ref: "Office", required: true },
    designationDuringPosting: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    postingType: { 
      type: String, 
      required: true,
    },
    reason: { type: String },
    remarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.PostingHistory || mongoose.model("PostingHistory", PostingHistorySchema);
