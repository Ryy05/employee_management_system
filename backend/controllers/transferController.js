import TransferRequest from "../models/TransferRequest.js";
import TransferRemark from "../models/TransferRemark.js";
import mongoose from "mongoose";
import { 
  createTransferRequest as createTransferRequestService,
  approveTransferRequestService as approveTransferRequestService, 
} from "../services/transferService.js";
import { createLog } from "../services/logService.js";
import Office from "../models/Office.js";
import Employee from "../models/Employee.js";
export const getTransferRequests = async (req, res) => {
  try {
    const requests = await TransferRequest.find()
      .populate("employee")
      .populate("fromOffice")
      .populate("toOffice")
      .exec();

    res.json({ transferRequests: requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transfer requests", error: error.message });
  }
};



export const createTransferRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      employee,
      fromOffice,
      toOffice,
      transferType,
      transferDate,
      transferReason,
      transferOrderNo,
      transferOrderDate,
      transferOrder,
    } = req.body;
    console.log("req.body", req.body);

    if (!employee || !fromOffice || !toOffice || !transferType || !transferDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    

    const transferRequest = await createTransferRequestService(
      {
        employee,
        fromOffice,
        toOffice,
        transferType,
        transferDate,
        transferReason,
        transferOrderNo,
        transferOrderDate,
        transferOrder,
      },
      req.user,
      req.ip
    );

    const [from, to] = await Promise.all([
      Office.findById(fromOffice).select("officeName"),
      Office.findById(toOffice).select("officeName"),
    ]);

    const userDetails = await User.findOne({ _id: req.body.user?.userId });
    
    await createLog({
      admin: userDetails?.userName || "System",
      role: userDetails?.role || "Unknown",
      office: userDetails?.office?.toString() || null,
      action: "TRANSFER_EMPLOYEE",
      description: `Transfer request created for employee ID "${employee}" from "${from.officeName}" to "${to.officeName}" on ${transferDate}.`,
      ip: req.ip,
    });

    return res.status(201).json({ message: "Transfer request created", transferRequest });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating transfer request",
      error: error.message,
    });
  }
};



export const approveTransferRequest = async (req, res) => {
  try {
    const { action, remarkText } = req.body;
    const transferRequest = await approveTransferRequestService(
      req.params.id,
      action,
      req.user,
      req.ip,
      remarkText
    );
    const [from, to, employee] = await Promise.all([
      Office.findById(transferRequest.fromOffice).select("officeName"),
      Office.findById(transferRequest.toOffice).select("officeName"),
      Employee.findById(transferRequest.employee).select("name employeeId"),
    ]);
    const description = `Transfer request for employee "${employee?.name}" (${employee?.employeeId}) has been ${action}ed. From "${from?.officeName}" to "${to?.officeName}".`;
    const userDetails = await User.findOne({ _id: req.body.user?.userId });
    console.log("userDetails",userDetails);
        
    await createLog({
      admin: userDetails?.userName || "System",
      role: userDetails?.role || "Unknown",
      office: userDetails?.office?.toString() || null,
      action: `TRANSFER_${action.toUpperCase()}`,
      description,
      ip: req.ip,
    });
    res.json({ message: `Transfer request ${action}d successfully`, transferRequest });
  } catch (error) {
    res.status(500).json({ message: "Error processing transfer request", error: error.message });
  }
};


export const respondToTransferRequest = async (req, res) => {
  const requestId = req.params.id;
  const { action, reason = "" } = req.body;
  const currentUser = req.user; 
  const ip = req.ip; 
  console.log("Incoming request to respond to transfer request with ID:", req.params.id); 
  try {
    console.log("🔍 Received Transfer Response Request:", { requestId, action, reason });

    const transferRequest = await TransferRequest.findById(requestId);
    if (!transferRequest) throw new Error("Transfer request not found");

    if (transferRequest.status === "Approved" || transferRequest.status === "Rejected") {
      throw new Error("Transfer request has already been completed and cannot be modified.");
    }

    if (transferRequest.status !== "CEOApproved") {
      throw new Error("Transfer request has not been approved by the Main Admin yet");
    }

    let remarkType = "";
    let remarkText = "";

    if (action === "accept") {
      transferRequest.status = "Approved";
      transferRequest.acceptedBy = currentUser.userId;
      transferRequest.acceptanceDate = new Date();

      remarkType = "SchoolAdminApproval";
      remarkText = "Accepted by Receiving Office Admin";
    } else if (action === "reject") {
      const trimmedReason = reason.trim();
      if (!trimmedReason) throw new Error("Rejection reason is required");

      transferRequest.status = "Rejected";
      transferRequest.processedBy = currentUser.userId;
      transferRequest.approvalDate = new Date();

      remarkType = "Rejection";
      remarkText = trimmedReason;
    } else {
      throw new Error("Invalid action");
    }

    // Save updated transfer request
    await transferRequest.save();

    // Save remark
    await TransferRemark.create({
      transfer: transferRequest._id,
      remarkType,
      remarkText,
      addedBy: currentUser.userId,
    });

    const [from, to, employee] = await Promise.all([
      Office.findById(transferRequest.fromOffice).select("officeName"),
      Office.findById(transferRequest.toOffice).select("officeName"),
      Employee.findById(transferRequest.employee).select("name employeeId"),
    ]);

    const description = `Transfer request for employee "${employee?.name}" (${employee?.employeeId}) has been ${action}ed by receiving admin. From "${from?.officeName}" to "${to?.officeName}".`
      + (action === "reject" ? ` Rejection reason: ${remarkText}` : "");
    // Log action
    const userDetails = await User.findOne({ _id: req.body.user?.userId });
        
    await createLog({
      admin: userDetails?.userName || "System",
      role: userDetails?.role || "Unknown",
      office: userDetails?.office?.toString() || null,
      action: `TRANSFER_${action.toUpperCase()}_BY_RECEIVER`,
      description,
      ip,
    });

    return transferRequest;
  } catch (error) {
    console.error("❌ Error in respondToTransferRequest:", error.message);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

