import Office from "../models/Office.js";
import School from "../models/School.js";
import User from "../models/User.js";
import Zone from "../models/Zone.js";
import mongoose from "mongoose";
import { createLog } from "../services/logService.js";

// A helper function to get full DDO details using the ddoOfficerId (employeeId)
import Employee from "../models/Employee.js";
const getDdoOfficerDetails = async (ddoOfficerId) => {
  if (!ddoOfficerId) return null;
  // Assuming that the Employee model uses employeeId as a unique identifier
  const ddoOfficer = await Employee.findOne({ employeeId: ddoOfficerId });
  return ddoOfficer;
};

// Get all offices
export const getOffices = async (req, res) => {
  try {
    const offices = await Office.find()
      .select(" officeName officeType ddoOfficerId isDdo ddoCode parentOffice contact address")
      .populate("parentOffice", "officeName"); // No 'schools' population since it's not in the schema
    res.json({ offices });
  } catch (error) {
    res.status(500).json({ message: "Error fetching offices", error: error.message });
  }
};

// Get an office by ID
export const getOfficeById = async (req, res) => {
  try {
    const { officeId } = req.params;
    const office = await Office.findById(officeId)
      .populate("parentOffice", "officeName");

    if (!office) {
      return res.status(404).json({ message: "Office not found" });
    }

    let ddoOfficerDetails = null;
    if (office.ddoOfficerId) {
      ddoOfficerDetails = await getDdoOfficerDetails(office.ddoOfficerId);
    }

    res.json({ office, ddoOfficerDetails });
  } catch (error) {
    res.status(500).json({ message: "Error fetching office", error: error.message });
  }
};

// Create a new office
export const createOffice = async (req, res) => {
  console.log("Request body:", req?.body);
  const session = await mongoose.startSession();
  let transactionCommitted = false;

  session.startTransaction();
  try {
    const {
      officeName, 
      officeType, 
      ddoOfficer, 
      schools, 
      ddoCode, 
      parentOffice, 
      isDdo, 
      zone,
      user, 
    } = req.body;

    if ( !officeName || !officeType) {
      return res.status(400).json({ message: "Office ID, name, and type are required" });
    }

    let schoolIds = [];

    const officeData = {
      officeName,
      officeType,
      ddoOfficerId: ddoOfficer,
      ddoCode,
      parentOffice: parentOffice || undefined,
      isDdo,
      zone: zone,
    };

    const officeObject = await new Office(officeData).save({ session });

    // If it's an educational office, we need to create schools and their admins
    if (officeType === "Educational" && schools && schools.length > 0) {
      for (const schoolData of schools) {
        const { adminUserName, adminPassword, ...schoolDetails } = schoolData;

        // Create School
        const newSchool = new School({ ...schoolDetails, office: officeObject._id, zone });
        await newSchool.save({ session });
        schoolIds.push(newSchool._id);

        if (adminUserName && adminPassword) {
          // Create User with full information
          const newUser = new User({
            userName: adminUserName,
            password: adminPassword,
            role: "schoolAdmin",
            office: officeObject._id,
            schoolId: newSchool._id,
            zoneId: zone,
            passwordChanged: false
          });

          await newUser.save({ session });
        }
      }
    }

    // Add the new office to the Zone's `offices` array
    if (zone) {
      const updatedZone = await Zone.findByIdAndUpdate(
        zone,
        { $push: { offices: officeObject._id } },
        { new: true, useFindAndModify: false, session }
      );

      if (!updatedZone) {
        throw new Error("Zone not found. Unable to add office to the zone.");
      }
    }

    // Link Schools & Users to the Office
    if (schoolIds.length > 0) {
      await Promise.all([
        School.updateMany(
          { _id: { $in: schoolIds } }, 
          { $set: { office: officeObject._id } },
          { session }
        ),
        User.updateMany(
          { schoolId: { $in: schoolIds } }, 
          { $set: { office: officeObject._id } },
          { session }
        )
      ]);
    }
    
    await session.commitTransaction();
    transactionCommitted = true;
    const userDetails = await User.findOne({ _id: user?.userId });

    await createLog({
      admin: userDetails?.userName || "System",
      role: userDetails?.role || "Unknown",
      action: "CREATE_OFFICE",
      office: userDetails?.office?.toString() || null,
      description: `Office "${officeObject.officeName}" created successfully`,
      ip: req.ip,
    });   
    res.status(201).json({ message: "Office created successfully", office: officeObject });

  } catch (error) {
    if (!transactionCommitted) {
      // ✅ Abort transaction only if it hasn't been committed
      await session.abortTransaction();
    }
    console.error("Error creating office:", error.message);
    res.status(500).json({ message: "Error creating office", error: error.message });

  } finally {
    session.endSession(); // ✅ Always end the session, regardless of success or failure
  }
};



// Update an existing office
export const updateOffice = async (req, res) => {
  try {
    const { officeId } = req.params; // officeId here is the _id of the Office document
    const { officeName, officeType, ddoOfficer, ddoCode, parentOffice, isDdo, address, contact } = req.body;

    const updatedOffice = await Office.findByIdAndUpdate(
      officeId,
      { officeName, officeType, ddoOfficerId: ddoOfficer, ddoCode, parentOffice, isDdo, address, contact },
      { new: true }
    ).populate("parentOffice", "officeName");

    if (!updatedOffice) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.json({ message: "Office updated", office: updatedOffice });
  } catch (error) {
    res.status(500).json({ message: "Error updating office", error: error.message });
  }
};

// Delete an office
export const deleteOffice = async (req, res) => {
  try {
    const { officeId } = req.params;
    const deletedOffice = await Office.findByIdAndDelete(officeId);

    if (!deletedOffice) {
      return res.status(404).json({ message: "Office not found" });
    }

    res.json({ message: "Office deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting office", error: error.message });
  }
};


