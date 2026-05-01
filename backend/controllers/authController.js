import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createLog } from "../services/logService.js";
import {
  registerZonalAdmin as registerZonalAdminService,
  registerSchoolAdmin as registerAdminService,
  registerStaff as registerStaffService,
  updatePassword as updatePasswordService,
} from "../services/userService.js";

export const loginUser = async (req, res) => {
  console.log("Login Request:", req.body);
  try {
    const { userName, password, loginAs } = req.body;
    const user = await User.findOne({ userName }).populate('office');
    console.log("User login:", user); 
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Compare the string role directly
    if (loginAs && user.role !== loginAs) {
      return res.status(403).json({ message: `You are not authorized to login as ${loginAs}` });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await createLog({
        admin: userName,
        role: user.role,
        action: "Failed Login",
        office: user.office?._id || null,
        description: "Unsuccessful login attempt",
        ip: req.ip,
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const payload = {
      userId: user._id,
      role: user.role,
      forcePasswordChange: !user.passwordChanged,
      officeId: user.office?._id || null,
    };
    if (user.role === "schoolAdmin") {
      payload.schoolId = user.schoolId;
    }
    if (user.role === "staff") {
      payload.employeeId = user.employeeId;
      payload.schoolId = user.schoolId;
    }
    if (user.role === "ZEO") {
      payload.zoneId = user.zoneId;
    }
    if (user.role === "CEO") {
      payload.districtId = user.districtId;
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    await createLog({
      admin: userName,
      office: user.office?._id || null,
      role:  user.role,
      action: "Login",
      description: `${userName} logged in successfully as ${user.role}`,
      ip: req.ip,
    });
    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id,
      forcePasswordChange: !user.passwordChanged,
      officeId: user.office ? user.office._id : null,
      ...(user.role === "schoolAdmin" && { schoolId: user.schoolId }),
      ...(user.role === "staff" && { employeeId: user.employeeId, schoolId: user.schoolId }),
      ...(user.role === "ZEO" && { zoneId: user.zoneId }),
      ...(user.role === "CEO" && { districtId: user.districtId }),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const updatedUser = await updatePasswordService(req.user.userId, newPassword, req.ip);
    res.status(200).json({ message: "Password updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};

export const registerZonalAdmin = async (req, res) => {
  try {
    // Adjust this check if your main admin role is different (e.g., "CEO")
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only the main admin can register a zonal admin" });
    }
    const { userName, password, zoneId } = req.body;
    const newUser = await registerZonalAdminService({ userName, password, zoneId }, req.user, req.ip);
    res.status(201).json({ message: "Zonal admin registered", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Error registering zonal admin", error: error.message });
  }
};

export const registerSchoolAdmin = async (req, res) => {
  try {
    // Adjust this check if your main admin role is different (e.g., "CEO")
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only the main admin can register a school admin" });
    }
    const { userName, password, schoolId } = req.body;
    const newUser = await registerAdminService({ userName, password, schoolId }, req.user, req.ip);
    res.status(201).json({ message: "School admin registered", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Error registering school admin", error: error.message });
  }
};

export const registerStaff = async (req, res) => {
  try {
    if (!(req.user.role === "schoolAdmin" || req.user.role === "admin")) {
      return res.status(403).json({ message: "Only school admins or the main admin can register staff" });
    }
    const { userName, password, employeeId } = req.body;
    const newUser = await registerStaffService({ userName, password, employeeId }, req.user, req.ip);
    res.status(201).json({ message: "Staff registered", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Error registering staff", error: error.message });
  }
};
