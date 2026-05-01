// import mongoose from "mongoose";

// const LogSchema = new mongoose.Schema(
//   {
//     admin: { type: String, required: true },
//     role: { type: String, required: true }, 
//     action: { type: String, required: true }, 
//     school: { type: String, default: "-" }, 
//     description: { type: String, required: true },
//     ip: { type: String }, 
//     timestamp: { type: Date, default: Date.now }
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Log || mongoose.model("Log", LogSchema);


import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
  {
    admin: { type: String, required: true },
    role: { type: String, required: true },
    action: { type: String, required: true },
    office: { type: mongoose.Schema.Types.ObjectId, ref: "Office" },
    description: { type: String, required: true },
    ip: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.Log || mongoose.model("Log", LogSchema);

