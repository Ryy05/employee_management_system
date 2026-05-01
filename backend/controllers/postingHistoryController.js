import PostingHistory from "../models/PostingHistory.js";
import Employee from "../models/Employee.js";
import Zone from "../models/Zone.js";
import { createLog } from "../services/logService.js";

export const getPostingHistoryByEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const history = await PostingHistory.find({ employee: req.params.employeeId }).populate("office");
    return res.json({ history });

  } catch (error) {
    res.status(500).json({ message: "Error fetching posting history", error: error.message });
  }
};

export const createPostingHistory = async (req, res) => {
  try {
    const { employee } = req.body;

    const employeeRecord = await Employee.findById(employee);
    if (!employeeRecord) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const newHistory = await PostingHistory.create(req.body);


    res.status(201).json({ message: "Posting history created", history: newHistory });
  } catch (error) {
    res.status(500).json({ message: "Error creating posting history", error: error.message });
  }
};
