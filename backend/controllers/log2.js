import Log from "../models/Log.js";
import Zone from "../models/Zone.js";
import Office from "../models/Office.js";

export const getLogs = async (req, res) => {
  try {
    const { role, officeId, zoneId } = req.user;
    let filter = {};

    if (role.roleName === "schoolAdmin") {
      filter.office = officeId;
    } else if (role.roleName === "ZEO") {
      const zone = await Zone.findById(zoneId).lean();
      if (zone) {
        filter.office = { $in: [...zone.offices, zone.myOffice] };
      }
    }

    const logs = await Log.find(filter).sort({ createdAt: -1 }).exec();

    const formattedLogs = logs.map((log) => ({
      action: log.action,
      description: log.description,
      admin: log.admin,
      role: log.role,
      ip: log.ip,
      time: new Date(log.createdAt).toLocaleString(),
    }));

    res.json({ logs: formattedLogs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Error fetching logs", error });
  }
};




export const getLocalStats = async (req, res) => {
  try {
    const { role, schoolId, zoneId, districtId } = req.user;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    let officeFilter = {};
    
    if (role.roleName === "School") {
      officeFilter._id = schoolId;
    } else if (role.roleName === "ZEO") {
      officeFilter.zoneId = zoneId;
    } else if (role.roleName === "CEO") {
      officeFilter.districtId = districtId;
    }

    // Step 1: Get relevant officeIds based on role
    const offices = await Office.find(officeFilter).select("_id");
    const officeIds = offices.map((office) => office._id);

    // Step 2: Filter logs by officeIds
    const filter = {
      createdAt: { $gte: twentyFourHoursAgo },
      officeId: { $in: officeIds },
    };

    const logs = await Log.find(filter)
      .populate("officeId", "name") // assuming you want the office name
      .populate("zoneId", "name")
      .populate("districtId", "name");

    const statsMap = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});

    const totalActions = logs.length;

    res.json({
      stats: [
        { title: "Total Actions (24h)", value: totalActions },
        {
          title: "Transfers Processed",
          value: statsMap["Transfer Request Review"] || 0,
        },
        {
          title: "Employee Updates",
          value: statsMap["Update Employee"] || 0,
        },
        {
          title: "Login Attempts",
          value: statsMap["Login"] || 0,
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};



export const getLastLogin = async (req, res) => {
  try {
    const { username } = req.params;

    const lastLoginLog = await Log.findOne({
      admin: username,
      action: "Login"
    })
      .sort({ createdAt: -1 })
      .skip(1)
      .limit(1)
      .exec();

    // If no login found, return empty object with defaults
    if (!lastLoginLog) {
      return res.status(200).json({
        lastLogin: null,
        ip: null,
        message: "No previous login record found"
      });
    }

    res.status(200).json({
      lastLogin: new Date(lastLoginLog.createdAt).toLocaleString(),
      ip: lastLoginLog.ip,
    });
  } catch (error) {
    console.error("Error fetching last login:", error);
    res.status(500).json({ message: "Error fetching last login", error });
  }
};

