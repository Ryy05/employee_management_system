import Log from "../models/Log.js";
import Zone from "../models/Zone.js";

export const getLogs = async (req, res) => {
  try {
    const { role, officeId,  districtId } = req.user;
    let filter = {};
    if (role.roleName === "CEO") {
      filter.districtId = districtId;
    }

    const logs = await Log.find(filter).sort({ createdAt: -1 }).lean().exec();

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
    res.status(500).json({ message: "Error fetching logs", error });
  }
};

export const getLocalStats = async (req, res) => {
  try {
    const { role, schoolId, zoneId, districtId } = req.user;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    let match = { createdAt: { $gte: twentyFourHoursAgo } };

    if (role.roleName === "School") {
      match.school = schoolId;
    } else if (role.roleName === "ZEO") {
      match.zoneId = zoneId;
    } else if (role.roleName === "CEO") {
      match.districtId = districtId;
    }

    const stats = await Log.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalActions = stats.reduce((acc, cur) => acc + cur.count, 0);
    res.json({
      stats: [
        { title: "Total Actions (24h)", value: totalActions },
        {
          title: "Transfers Processed",
          value: stats.find((s) => s._id === "Transfer Request Review")?.count || 0,
        },
        {
          title: "Employee Updates",
          value: stats.find((s) => s._id === "Update Employee")?.count || 0,
        },
        {
          title: "Login Attempts",
          value: stats.find((s) => s._id === "Login")?.count || 0,
        }
      ],
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
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

export const getLogsForZone = async (req, res) => {
  try {
    const { zoneId } = req.params;
    const zone = await Zone.findById(zoneId).populate("offices");
    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    const officeIds = zone.offices.map((office) => office._id);

    // Fetch logs where office is in officeIds
    const logs = await Log.find({ office: { $in: officeIds } })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const formattedLogs = logs.map((log) => ({
      action: log.action,
      description: log.description,
      admin: log.admin,
      role: log.role,
      ip: log.ip,
      time: new Date(log.createdAt).toLocaleString(),
    }));

    res.json({ zone: zone.name, logs: formattedLogs });
  } catch (error) {
    console.error("Error fetching zone logs:", error);
    res.status(500).json({ message: "Error fetching logs for zone", error });
  }
};

export const getLogsForOffice = async (req, res) => {
  try {
    const { officeId } = req.params;

    const logs = await Log.find({ office: officeId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const formattedLogs = logs.map((log) => ({
      action: log.action,
      description: log.description,
      admin: log.admin,
      role: log.role,
      ip: log.ip,
      time: new Date(log.createdAt).toLocaleString(),
    }));

    res.json({ officeId, logs: formattedLogs });
  } catch (error) {
    console.error("Error fetching office logs:", error);
    res.status(500).json({ message: "Error fetching logs for office", error });
  }
};
