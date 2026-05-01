import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    role: { 
      type: String, 
      required: true, 
      enum: ["CEO", "ZEO", "schoolAdmin", "staff"]
    },
    password: { type: String, required: true },
    office: { type: mongoose.Schema.Types.ObjectId, ref: "Office", default: null },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    passwordChanged: { type: Boolean, default: false },
    zoneId: { type: mongoose.Schema.Types.ObjectId, ref: "Zone", default: null },
    districtId: { type: mongoose.Schema.Types.ObjectId, ref: "District", default: null },
  },
  { timestamps: true }
);


UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});


UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
