import mongoose from "mongoose";

const AttendanceRecordSchema = new mongoose.Schema(
  {
    employeeId: { type: Number, required: true },
    status: { type: String, required: true }
  },
  { _id: false }
);

const DailyAttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  attendanceRecords: [AttendanceRecordSchema],
  notes: { type: String }
});

export default mongoose.model("DailyAttendance", DailyAttendanceSchema);
