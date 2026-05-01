import mongoose from "mongoose";
import dotenv from "dotenv";
import Log from "./models/Log.js"; // Adjust the path if your model is elsewhere

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourDatabaseName";

const cleanLogCollection = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Delete all documents in the Log collection
    const result = await Log.deleteMany({});
    console.log(`🧹 Deleted ${result.deletedCount} logs from the collection.`);

    // Optional: Drop the entire collection (use with caution!)
    // await mongoose.connection.db.dropCollection('logs');
    // console.log("🗑️ Dropped 'logs' collection.");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

cleanLogCollection();
