"use client";

import React, { useState } from "react";
import { CheckCircle, XCircle, Search as SearchIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import {
  getTransferRequests,
  respondToTransferRequest,
} from "@/api/transferService";
import Link from "next/link";

export default function TransferHistoryPage() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // States for handling rejection modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRequestId, setRejectRequestId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const {
    data: transfersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transfers"],
    queryFn: getTransferRequests,
    refetchOnWindowFocus: false,
  });

  const transferRequests = Array.isArray(transfersData)
    ? transfersData
    : transfersData?.transferRequests || [];
  console.log("Transfers data:", transferRequests);

  const currentTransfers = transferRequests.filter(
    (t) =>
      t.status === "CEOApproved" &&
      t.toOffice &&
      t.toOffice._id &&
      t.toOffice._id.toString() === user.officeId.toString()
  );

  const historyTransfers = transferRequests.filter(
    (t) =>
      (t.status === "Approved" || t.status === "Rejected") &&
      t.toOffice &&
      t.toOffice._id &&
      t.toOffice._id.toString() === user.officeId.toString()
  );

  const filterTransfers = (transfersArray) =>
    transfersArray.filter((transfer) => {
      const employeeName = transfer.employee?.employeeName || "";
      const fromSchoolName = transfer.fromOffice?.officeName || "";
      const toSchoolName = transfer.toSchool?.name || "";
      const status = transfer.status || "";
      return (
        employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fromSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        toSchoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const filteredCurrent = filterTransfers(currentTransfers);
  console.log("Filtered Current:", filteredCurrent);
  const filteredHistory = filterTransfers(historyTransfers);
  console.log("Filtered History:", filteredHistory);

  // Mutation for responding to a transfer request (accept or reject)
  const respondMutation = useMutation({
    mutationFn: async ({ requestId, action, reason }) => {
      console.log("🔍 Sending Transfer Response Request:", {
        requestId,
        action,
        reason,
      });

      if (action === "reject" && (!reason || reason.trim() === "")) {
        toast.error("Rejection reason is required.");
        throw new Error("Rejection reason is required");
      }

      try {
        const response = await respondToTransferRequest(
          requestId,
          action,
          reason || ""
        );

        console.log("✅ Response from API:", response);
        return response;
      } catch (error) {
        console.error("❌ Error responding to transfer request:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      toast.success("Response submitted successfully");

      // Reset modal state on success
      setShowRejectModal(false);
      setRejectRequestId(null);
      setRejectReason("");
    },
    onError: (err) => {
      console.error("🚨 Mutation Error:", err);
      toast.error(err.message || "Error responding to transfer request");
    },
  });

  const handleAccept = (requestId) => {
    respondMutation.mutate({ requestId, action: "accept" });
  };

  const openRejectModal = (requestId) => {
    setRejectRequestId(requestId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    const trimmedReason = rejectReason.trim();
    console.log("Submitting rejection with reason:", trimmedReason);
    if (!trimmedReason) {
      toast.error("Rejection reason is required.");
      return;
    }
    respondMutation.mutate({
      requestId: rejectRequestId,
      action: "reject",
      reason: trimmedReason,
    });
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectRequestId(null);
    setRejectReason("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error) {
    return (
      <p className="text-center text-red-500">Error loading transfer history</p>
    );
  }

  return (
    <div className="min-h-screen pb-8 ">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="mb-10  ">
        <h1 className="text-2xl font-bold text-secondary">Transfer History</h1>
        <p className="mt-2 text-sm font-medium text-gray-600">
          View all transfer requests related to your school.
        </p>
      </header>
      <div className="  mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary">
          <div className="relative flex-1">
            <SearchIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
            <input
              type="text"
              placeholder="Search transfer history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Current Incoming Requests */}
      <div className=" px-4 bg-white p-6 rounded-lg shadow-sm mb-8 border-l-[3px] border-primary">
        <h2 className="text-xl font-bold text-secondary mb-4">
          Current Transfer Requests
        </h2>
        {filteredCurrent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    From Office
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    To Office
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[...filteredCurrent]
                  .sort((a, b) =>
                    (a.employee?.employeeId || "").localeCompare(
                      b.employee?.employeeId || ""
                    )
                  )
                  .map((transfer) => (
                    <tr key={transfer._id}>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.employee?.employeeId || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.fromOffice?.officeName || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.toOffice?.officeName || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.transferReason || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {new Date(transfer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(transfer._id)}
                            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 transition text-white px-3 py-1 rounded text-xs"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => openRejectModal(transfer._id)}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded text-xs"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                          <button
                            onClick={() => setSelectedTransfer(transfer)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">
            No current transfer requests found.
          </p>
        )}
      </div>

      {/* Transfer History */}
      <div className=" px-4 bg-white p-6 rounded-lg shadow-sm mb-8 border-l-[3px] border-primary">
        <h2 className="text-xl font-bold text-secondary mb-4">
          Transfer History
        </h2>
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    From School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    To School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
              {[...filteredHistory]
                  .sort((a, b) =>
                    (a.employee?.employeeId || "").localeCompare(
                      b.employee?.employeeId || ""
                    )
                  ).map((transfer) => (
                  <tr key={transfer._id}>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {transfer.employee?.employeeId || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {transfer.fromOffice?.officeName || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {transfer.toOffice?.officeName || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                    {transfer.transferReason || "N/A"}
                    </td>
                    <td
                      className={`px-6 py-3 text-sm font-semibold ${
                        transfer.status === "Approved"
                          ? "text-green-600"
                          : transfer.status === "Rejected"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {transfer.status === "Approved"
                        ? "Approved"
                        : transfer.status === "Rejected"
                        ? "Rejected"
                        : transfer.status}
                    </td>

                      <td className="px-6 py-3 text-sm text-gray-900">
                        {new Date(transfer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500">
            No transfer history found.
          </p>
        )}
      </div>

      {/* Modal for entering rejection reason */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-md z-10 w-96">
            <h2 className="text-xl font-bold mb-4">Reject Transfer Request</h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              className="w-full p-2 border rounded mb-4"
              rows={4}
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleRejectCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedTransfer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <h3 className="text-xl font-bold mb-4">Transfer Details</h3>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setSelectedTransfer(null)}
            >
              ✕
            </button>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Employee ID:</strong>{" "}
                {selectedTransfer.employee?.employeeId}
              </div>
              <div>
                <strong>Employee Name:</strong>{" "}
                {selectedTransfer.employee?.fullName}
              </div>
              <div>
                <strong>From Office:</strong>{" "}
                {selectedTransfer.fromOffice?.officeName}
              </div>
              <div>
                <strong>To Office:</strong>{" "}
                {selectedTransfer.toOffice?.officeName}
              </div>
              <div>
                <strong>Transfer Reason:</strong>{" "}
                {selectedTransfer.transferReason}
              </div>
              <div>
                <strong>Transfer Date:</strong>{" "}
                {new Date(selectedTransfer.transferDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Transfer Order No:</strong>{" "}
                {selectedTransfer.transferOrderNo}
              </div>
              <div>
                <strong>Transfer Order Date:</strong>{" "}
                {new Date(
                  selectedTransfer.transferOrderDate
                ).toLocaleDateString()}
              </div>
              <div>
                <strong>Transfer Type:</strong> {selectedTransfer.transferType}
              </div>
              <div>
                <strong>Transfer Order File:</strong>{" "}
                <a
                  href={selectedTransfer.transferOrder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Document
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
