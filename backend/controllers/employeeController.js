
import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import School from "../models/School.js";
import Zone from "../models/Zone.js";
import { createLog } from "../services/logService.js";
import User from "../models/User.js";
// import BasicPay from "../models/BasicPay.js";
// import DA from "../models/DA.js";
// import HRA from "../models/HRA.js";
import EmployeeSalaries from "../models/EmployeeSalary.js";
import PostingHistory from "../models/PostingHistory.js";
import Office from "../models/Office.js";


export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error: error.message });
  }
};

export const getDdoOfficerDetails = async (ddoOfficerId) => {
  if (!ddoOfficerId) return null;
  const ddoOfficer = await Employee.findOne({ employeeId: ddoOfficerId });
  return ddoOfficer;
};

export const getEmployeesByZone = async (req, res) => {
  try {
    const zoneId = req.params.zoneId;
    const offices = await Office.find({ zone: zoneId });
    const officeIds = offices.map(o => o._id);
    const employees = await Employee.find({ office: { $in: officeIds } });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees by zone", error: error.message });
  }
};

export const getEmployeesByOffice = async (req, res) => {
  try {
    const officeId = req.params.officeId;
    const employees = await Employee.find({ office: officeId });

    employees.sort((a, b) => {
      // First, prioritize 'Headmaster' designation
      if (a.presentDesignation === "HEADMASTER") return -1;
      if (b.presentDesignation === "HEADMASTER") return 1;

      // If neither is 'Headmaster', sort alphabetically by fullName
      return a.fullName.localeCompare(b.fullName);
    });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees by office", error: error.message });
  }
};
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('office')
      .populate('postedOffice');

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error: error.message });
  }
};




export const createEmployee = async (req, res) => {
  console.log("Request body:", req.body);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const officeId = req.body.office || req.body.officeId;
    console.log("Office ID:", officeId);
    if (!officeId || !mongoose.Types.ObjectId.isValid(officeId)) {
      return res.status(400).json({ message: "Valid Office ID is required" });
    }
    const office = await Office.findById(officeId);
    if (!office) return res.status(404).json({ message: "Office not found" });

   
    const newEmployeeData = { ...req.body, office: officeId };
    const newEmployeeArr = await Employee.create([newEmployeeData], { session });
    const savedEmployee = newEmployeeArr[0];

    
    const newUser = await User.create(
      [
        {
          userName: req.body.employeeId || savedEmployee.employeeId,
          role: 'staff',
          password: req.body.credentials?.passwordHash,
          office: officeId,
          employeeId: savedEmployee._id,
          passwordChanged: false,
        },
      ],
      { session }
    );

    if (req.body.postingHistory && Array.isArray(req.body.postingHistory)) {
      const postingRecords = req.body.postingHistory.map((posting) => ({
        employee: savedEmployee._id,
        office: posting.office,
        designationDuringPosting: posting.designationDuringPosting,
        startDate: posting.startDate,
        endDate: posting.endDate,
        postingType: posting.postingType,
        reason: posting.reason,
        remarks: posting.remarks,
      }));

      if (postingRecords.length > 0) {
        await PostingHistory.insertMany(postingRecords, { session });
      }
    }

    // Log the employee creation action
    const userDetails = await User.findOne({ _id: req.body.user?.userId });
    
    await createLog({
      admin: userDetails?.userName || "System",
      role: userDetails?.role || "Unknown",
      action: "CREATE_OFFICE",
      office: userDetails?.office?.toString() || null,
      description: `Created employee ${savedEmployee.fullName}`,
      ip: req.ip,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Employee created successfully", employee: savedEmployee });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Error creating employee", error: error.message });
  }
};



export const updateEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const employeeId = req.params.id;

    // 1. Update Employee
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      req.body,
      { new: true, session }
    );
    if (!updatedEmployee) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Employee not found" });
    }


    if (req.body.postingHistory && Array.isArray(req.body.postingHistory)) {

      await PostingHistory.deleteMany({ employee: employeeId }, { session });

      const newPostings = req.body.postingHistory.map((posting) => {
        const officeId =
          typeof posting.office === "object"
            ? posting.office._id || posting.office.officeId // fallback if somehow still has officeId
            : posting.office;
      
        return {
          employee: employeeId,
          office: officeId,
          designationDuringPosting: posting.designationDuringPosting,
          startDate: posting.startDate,
          endDate: posting.endDate,
          postingType: posting.postingType?.toLowerCase(),
          reason: posting.reason,
          remarks: posting.remarks,
        };
      });
      

      if (newPostings.length > 0) {
        await PostingHistory.insertMany(newPostings, { session });
      }
    }


    await createLog({
      admin: req.user.userId,
      role: req.user.role,
      action: "Update Employee",
      description: `Updated employee ${updatedEmployee.fullName}`,
      ip: req.ip,
    });

    await session.commitTransaction();
    session.endSession();

    res.json(updatedEmployee);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Error updating employee", error: error.message });
  }
};


export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await createLog({
      admin: req.user.userId,
      role: req.user.role,
      action: "Delete Employee",
      description: `Deleted employee ${deletedEmployee.fullName}`,
      ip: req.ip,
    });
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};
