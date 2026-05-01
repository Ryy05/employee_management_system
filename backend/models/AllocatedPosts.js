import mongoose from "mongoose";

const AllocatedPostsSchema = new mongoose.Schema({
  office: { type: mongoose.Schema.Types.ObjectId, ref: "Office", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  totalAllocated: { type: Number, required: true },
  filledPosts: { type: Number, required: true },
  vacantPosts: { type: Number } 
}, { timestamps: true });

export default mongoose.models.AllocatedPosts || mongoose.model("AllocatedPosts", AllocatedPostsSchema);
