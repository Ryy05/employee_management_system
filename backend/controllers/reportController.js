import Employee from "../models/Employee.js";
import School from "../models/School.js";
export const getSchoolReport = async (req, res) => {
  const { role, schoolId, zoneId } = req.user;
  let filter = {};

  if (role === "schoolAdmin") filter._id = schoolId;
  if (role === "zeo") filter.zone = zoneId;
  if (req.query.zoneId) filter.zone = req.query.zoneId;
  if (req.query.schoolId) filter._id = req.query.schoolId;

  const schools = await School.find(filter).populate("zone").populate("office");

  const data = schools.map(school => ({
    Zone: school.zone?.name,
    SchoolName: school.office?.officeName,
    SchoolID: school.udiseId,
    Address: school.address,
    Principal: school.principal,
    Contact: school.office?.contact || "-",
    Scheme: school.scheme,
    NoOfStudents: school.numberOfStudents,
    IsPMShiriSchool: school.isPMShiriSchool ? "Yes" : "No",
  }));

  return res.json(data); // ← Send raw JSON
};


  

export const getEmployeeReport = async (req, res) => {
  try {
    const { role, schoolId, zoneId } = req.user;
    const { zoneId: queryZoneId, schoolId: querySchoolId } = req.query;

    let schoolFilter = {};

    if (role === "schoolAdmin") {
      schoolFilter._id = schoolId;
    } else if (role === "zeo") {
      schoolFilter.zone = zoneId;
    }

    if (queryZoneId) {
      schoolFilter.zone = queryZoneId;
    }
    if (querySchoolId) {
      schoolFilter._id = querySchoolId;
    }

    // Step 1: Fetch schools and their office info
    const schools = await School.find(schoolFilter)
      .select("_id office zone")
      .populate("office zone");

    const officeIdToMetaMap = new Map();

    schools.forEach((school) => {
      if (!school.office) return; // skip if office is not populated

      officeIdToMetaMap.set(String(school.office._id), {
        officeId: school.office._id,
        schoolName: school.office.officeName || "N/A",
        zone: school.zone?.name || "N/A",
      });
    });

    const officeIds = Array.from(officeIdToMetaMap.keys());

    // Step 2: Fetch employees using office
    const employees = await Employee.find({ office: { $in: officeIds } }).populate("office");

    // Step 3: Format report data
    const reportData = employees.map((emp) => {
      const plain = emp.toObject();
      delete plain._id; // Remove the MongoDB _id field
      delete plain.__v;
      delete plain.credentials; // (Optional) Also remove __v if you don't need it
    
      return plain;
    });

    return res.json(reportData);
  } catch (error) {
    console.error("Error generating employee report:", error);
    res.status(500).json({ message: "Failed to generate report", error: error.message });
  }
};



  