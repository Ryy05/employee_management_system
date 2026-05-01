import EmployeeSalaries from "../models/EmployeeSalaries.js";
import Employee from "../models/Employee.js";
import BasicPay from "../models/BasicPay.js";
import DA from "../models/DA.js";
import HRA from "../models/HRA.js";


export const getEmployeeSalaries = async (req, res) => {
  try {
    const salaries = await EmployeeSalaries.find()
      .populate("employee", "employeeId fullName")
      .populate("basicPay")
      .populate("da")
      .populate("hra");

    res.json({ salaries });
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee salaries", error: error.message });
  }
};


export const createEmployeeSalary = async (req, res) => {
  try {
    const { employee, basicPay, da, hra, otherAllowances } = req.body;

    
    const employeeExists = await Employee.findById(employee);
    if (!employeeExists) {
      return res.status(400).json({ message: "Invalid Employee ID" });
    }

    
    const basicPayRecord = await BasicPay.findById(basicPay);
    if (!basicPayRecord) {
      return res.status(400).json({ message: "Invalid Basic Pay ID" });
    }

    
    const daRecord = await DA.findById(da);
    if (!daRecord) {
      return res.status(400).json({ message: "Invalid DA ID" });
    }

    
    const hraRecord = await HRA.findById(hra);
    if (!hraRecord) {
      return res.status(400).json({ message: "Invalid HRA ID" });
    }

    
    const grossSalary = parseFloat(basicPayRecord.amount) + 
                        (parseFloat(basicPayRecord.amount) * (daRecord.daPercentage / 100)) +
                        (parseFloat(basicPayRecord.amount) * (hraRecord.hraPercentage / 100)) +
                        parseFloat(otherAllowances || 0);

    const employeeSalary = new EmployeeSalaries({
      employee,
      basicPay,
      da,
      hra,
      otherAllowances,
      grossSalary,
    });

    await employeeSalary.save();

    res.status(201).json({ message: "Employee salary created successfully", employeeSalary });
  } catch (error) {
    res.status(500).json({ message: "Error creating employee salary", error: error.message });
  }
};


export const getEmployeeSalaryById = async (req, res) => {
  try {
    const employeeSalary = await EmployeeSalaries.findById(req.params.id)
      .populate("employee", "employeeId fullName")
      .populate("basicPay")
      .populate("da")
      .populate("hra");

    if (!employeeSalary) {
      return res.status(404).json({ message: "Employee salary not found" });
    }

    res.json({ employeeSalary });
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee salary", error: error.message });
  }
};


export const updateEmployeeSalary = async (req, res) => {
  try {
    const { basicPay, da, hra, otherAllowances } = req.body;

    const employeeSalary = await EmployeeSalaries.findById(req.params.id);
    if (!employeeSalary) {
      return res.status(404).json({ message: "Employee salary not found" });
    }

    if (basicPay) employeeSalary.basicPay = basicPay;
    if (da) employeeSalary.da = da;
    if (hra) employeeSalary.hra = hra;
    if (otherAllowances !== undefined) employeeSalary.otherAllowances = otherAllowances;

    
    const basicPayRecord = await BasicPay.findById(basicPay || employeeSalary.basicPay);
    const daRecord = await DA.findById(da || employeeSalary.da);
    const hraRecord = await HRA.findById(hra || employeeSalary.hra);

    const grossSalary = parseFloat(basicPayRecord.amount) + 
                        (parseFloat(basicPayRecord.amount) * (daRecord.daPercentage / 100)) +
                        (parseFloat(basicPayRecord.amount) * (hraRecord.hraPercentage / 100)) +
                        parseFloat(otherAllowances || employeeSalary.otherAllowances || 0);

    employeeSalary.grossSalary = grossSalary;

    await employeeSalary.save();

    res.json({ message: "Employee salary updated successfully", employeeSalary });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee salary", error: error.message });
  }
};


export const deleteEmployeeSalary = async (req, res) => {
  try {
    const employeeSalary = await EmployeeSalaries.findByIdAndDelete(req.params.id);

    if (!employeeSalary) {
      return res.status(404).json({ message: "Employee salary not found" });
    }

    res.json({ message: "Employee salary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee salary", error: error.message });
  }
};
