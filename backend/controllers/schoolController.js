import School from "../models/School.js";
import Zone from "../models/Zone.js";
import Office from "../models/Office.js";

// Get all schools based on user role
export const getAllSchools = async (req, res) => {
  try {
    const { districtId, zoneId, officeId, role } = req.user; // Assuming user data is available in req.user

    let schools;

    if (role === "CEO") {
      // Fetch all schools within the user's district
      schools = await School.find({ district: districtId }).populate('zone');
    } 
    else if (role === "ZEO") {
      // Fetch all schools within the user's zone (by checking the offices in the zone)
      const zone = await Zone.findById(zoneId).populate("offices");
      const officeIds = zone.offices.map(office => office._id);

      schools = await School.find({ office: { $in: officeIds } }).populate('zone');
    } 
    else if (role === "schoolAdmin") {
      // Fetch the school associated with the user's office
      schools = await School.find({ office: officeId }).populate('zone');
    } 
    else {
      return res.status(403).json({ message: "You are not authorized to access this resource" });
    }

    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools", error: error.message });
  }
};

// Get single school by ID
export const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id)
      .populate("employees")
      .populate("zone");

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Error fetching school by ID", error: error.message });
  }
};

// Get school for logged-in schoolAdmin
export const getMySchool = async (req, res) => {
  try {
    const { officeId } = req.user;

    const school = await School.findOne({ office: officeId })
      .populate("employees")
      .populate("zone");

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    res.json(school);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your school", error: error.message });
  }
};

// Create school
export const createSchool = async (req, res) => {
  try {
    const { udiseId, name, office, feasibilityZone, principal, contact, dateOfEstablishment } = req.body;

    const officeExists = await Office.findById(office);
    if (!officeExists) {
      return res.status(400).json({ message: "Invalid office ID" });
    }

    const newSchool = new School({
      udiseId,
      name,
      office,
      feasibilityZone,
      principal,
      contact,
      dateOfEstablishment
    });

    await newSchool.save();

    res.status(201).json({ message: "School created successfully", school: newSchool });
  } catch (error) {
    res.status(500).json({ message: "Error creating school", error: error.message });
  }
};

// Update school
export const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received update data:", req.body);
    const updatedSchool = await School.findByIdAndUpdate(id, req.body, { new: true })
      .populate("zone");

    if (!updatedSchool) {
      return res.status(404).json({ message: "School not found" });
    }
    res.json({ message: "School updated successfully", school: updatedSchool });
  } catch (error) {
    res.status(500).json({ message: "Error updating school", error: error.message });
  }
};

// Delete school
export const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSchool = await School.findByIdAndDelete(id);

    if (!deletedSchool) {
      return res.status(404).json({ message: "School not found" });
    }

    res.json({ message: "School deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting school", error: error.message });
  }
};

export const getSchoolsByZoneId = async (req, res) => {
  try {
    const { zoneId } = req.params;

    const schools = await School.find({ zone: zoneId })
      .populate("zone")
      .populate("office");

    // Instead of returning 404, return empty array with 200
    if (!schools.length) {
      return res.status(200).json([]);
    }

    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools by zone", error: error.message });
  }
};


// Fetch all schools under a specific Office
export const getSchoolsByOfficeId = async (req, res) => {
  try {
    const { officeId } = req.params;

    const schools = await School.find({ office: officeId })
      .populate("zone")
      .populate("office");

    if (!schools.length) {
      return res.status(200).json([]);
    }

    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools by office", error: error.message });
  }
};


export const getSchoolsByDistrictId = async (req, res) => {
  try {
    const { districtId } = req.params;

    // Find all zones in the district
    const zones = await Zone.find({ district: districtId });
    const zoneIds = zones.map(zone => zone._id);

    if (!zoneIds.length) {
      return res.status(404).json({ message: "No zones found for the given district." });
    }

    // Fetch all schools under those zones
    const schools = await School.find({ zone: { $in: zoneIds } })
      .populate("zone")
      .populate("office");

    if (!schools.length) {
      return res.status(404).json({ message: "No schools found for the given district." });
    }

    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools by district", error: error.message });
  }
};
