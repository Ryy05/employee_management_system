
import Zone from "../models/Zone.js";
import District from "../models/District.js";
import User from "../models/User.js";
import Office from "../models/Office.js";
import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import School from "../models/School.js";
import { createLog } from "../services/logService.js";


export const getZones = async (req, res) => {
  try {
    const zones = await Zone.find().sort({name:1}).populate("district").populate("offices", "officeName");;
    res.status(200).json({ zones });
  } catch (error) {
    res.status(500).json({ message: "Error fetching zones", error: error.message });
  }
};


export const getZoneById = async (req, res) => {
  try {
    const { zoneId } = req.params;

    const zone = await Zone.findById(zoneId)
      .populate("district")
      .populate("myOffice")
      .populate("offices");

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    //custom sorting: Adminstrative first, then Educational sorted alphabetically
    zone.offices.sort((a, b) => {
      if (a.officeType === "Administrative") return -1; // Administrative always first
      if (b.officeType === "Administrative") return 1;  // Others follow
      return a.officeName.localeCompare(b.officeName);  // Alphabetical for Educational offices
    });

    await Promise.all(
      zone.offices.map(async (office) => {
        if (office.officeType === "Educational") {
          const schools = await School.find({ office: office._id });
          office._doc.schools = schools;
        }
      })
    );

    const zeoUser = await User.findOne({ zoneId: zone._id, role: "ZEO" });

    res.status(200).json({
      message: "Zone fetched successfully",
      zone,
      zeoUser,
    });
  } catch (error) {
    console.error("❌ Error fetching zone by ID:", error.message);
    res.status(500).json({ message: "Error fetching zone", error: error.message });
  }
};




export const createZone = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, district, zeoUserName, zeoPassword, zonalOffice } = req.body;

    if (!name || !district || !zonalOffice) {
      return res.status(400).json({ message: "Name, District, and Zonal Office are required" });
    }

    const existingDistrict = await District.findById(district);
    if (!existingDistrict) {
      return res.status(404).json({ message: "District not found" });
    }

    const existingZone = await Zone.findOne({ name, district });
    if (existingZone) {
      return res.status(400).json({ message: "Zone already exists in this district" });
    }


    if (!zonalOffice.officeName) {
      return res.status(400).json({ message: "Office Name is required in zonalOffice" });
    }


    const createdOffice = await Office.create([{
      officeId: zonalOffice.officeId,
      officeName: zonalOffice.officeName,
      officeType: 'Administrative',
      contact: zonalOffice.contact,
      address: zonalOffice.address
    }], { session });


    const newZone = await Zone.create([{
      name,
      district,
      myOffice: createdOffice[0]._id,
      offices: [createdOffice[0]._id]
    }], { session });

    if (!zeoUserName || !zeoPassword) {
      return res.status(400).json({ message: "ZEO Username and Password are required" });
    }


    const newUser = await User.create([{
      userName: zeoUserName,
      password: zeoPassword,
      role: 'ZEO',
      passwordChanged: false,
      districtId: district,
      zoneId: newZone[0]._id,
      office: createdOffice[0]._id
    }], { session });

    const userDetails = await User.findOne({ _id: req.body.user?.userId });
        
    await createLog({
      admin: userDetails?.userName || "System",
      role: userDetails?.role || "Unknown",
      office: userDetails?.office?.toString() || null,
      action: "CREATE_ZONE",
      ip: req.ip,
      description: `Created new Zone "${name}" under district "${existingDistrict.name}", along with zonal office "${zonalOffice.officeName}" and ZEO user "${zeoUserName}".`
    });


    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Zone, Zonal Office, and ZEO user created successfully", zone: newZone[0], user: newUser[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Error creating zone:", error.message);
    res.status(500).json({ message: "Error creating zone", error: error.message });
  }
};  


export const updateZone = async (req, res) => {
  try {
    const { zoneId } = req.params;
    const { name, district, zedioOfficer } = req.body;

    const updatedZone = await Zone.findByIdAndUpdate(
      zoneId,
      { name, district, zedioOfficer },
      { new: true }
    ).populate("district").populate("zedioOfficer", "fullName employeeId");

    if (!updatedZone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    res.json({ message: "Zone updated", zone: updatedZone });
  } catch (error) {
    res.status(500).json({ message: "Error updating zone", error: error.message });
  }
};


export const deleteZone = async (req, res) => {
  try {
    const { zoneId } = req.params;

    const deletedZone = await Zone.findByIdAndDelete(zoneId);

    if (!deletedZone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    res.json({ message: "Zone deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting zone", error: error.message });
  }
};

export const getEmployeeDetailsInZone = async (req, res) => {
  try {
    const { zoneId } = req.params;

    const zone = await Zone.findById(zoneId).populate("offices");

    if (!zone) return res.status(404).json({ message: "Zone not found" });

    const officeIds = zone.offices.map((office) => office._id);

    const employees = await Employee.find({ office: { $in: officeIds } });

    return res.json({ employees });
  } catch (err) {
    console.error("Error in getEmployeeDetailsInZone:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

