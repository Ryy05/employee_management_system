import TransferRequest from "../models/TransferRequest.js";
import TransferRemark from "../models/TransferRemark.js";
import Office from "../models/Office.js";
import { createLog } from "./logService.js";
import mongoose from "mongoose";

export const createTransferRequest = async (
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
  currentUser,
  ip
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingRequest = await TransferRequest.findOne({
      employee,
      status: "Pending",
    }).session(session);

    if (existingRequest) {
      throw new Error("A pending transfer request for this employee already exists");
    }

    const transferRequest = await TransferRequest.create(
      [{
        employee,
        fromOffice,
        toOffice,
        transferType,
        transferDate,
        transferReason,
        transferOrderNo,
        transferOrderDate,
        transferOrder,
        requestedBy: currentUser.userId,
        status: "Pending",
      }],
      { session }
    );

    await TransferRemark.create(
      [{
        transfer: transferRequest[0]._id,
        remarkType: "RequestCreation",
        remarkText: transferReason || "No remarks provided",
        addedBy: currentUser.userId,
      }],
      { session }
    );

    

    await session.commitTransaction();
    session.endSession();

    return transferRequest[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const approveTransferRequestService = async (requestId, action, currentUser, ip, remarkText = "") => {
  const transferRequest = await TransferRequest.findById(requestId);

  if (!transferRequest) throw new Error("Transfer request not found");

  if (action === "approve") {
    transferRequest.status = "CEOApproved";
  } else if (action === "reject") {
    transferRequest.status = "Rejected";
  } else {
    throw new Error("Invalid action");
  }

  await transferRequest.save();

  await TransferRemark.create({
    transfer: transferRequest._id,
    remarkType: action === "approve" ? "CEOApproval" : "Rejection",
    remarkText: remarkText || (action === "approve" ? "Approved by CEO" : "Rejected by CEO"),
    addedBy: currentUser.userId,
  });

  return transferRequest;
};


