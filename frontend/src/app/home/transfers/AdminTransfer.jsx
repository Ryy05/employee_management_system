import { useState } from "react";
import { CheckCircle, XCircle, ArrowLeftRightIcon, Search as SearchIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { getTransferRequests, approveTransferRequest } from "@/api/transferService";
import PdfPreview from "@/components/pdf";

export default function AdminTransfer() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRequestId, setRejectRequestId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isPdfView, setIsPdfView] = useState(false);


  const { data: transfersData, isLoading, error } = useQuery({
    queryKey: ["transfers"],
    queryFn: getTransferRequests,
    refetchOnWindowFocus: false,
  });

  const pendingTransfers = (transfersData?.transferRequests ?? []).filter(
    (t) => t.status === "Pending"
  );

  const approveMutation = useMutation({
    mutationFn: ({ requestId, action }) =>
      approveTransferRequest(requestId, action, "Reviewed by CEO"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      toast.success("Transfer request updated successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Error updating transfer request");
    },
  });

  const handleApprove = (requestId) => {
    approveMutation.mutate({ requestId, action: "approve" });
  };

  const handleReject = (requestId) => {
    approveMutation.mutate({ requestId, action: "reject" });
  };

  const filteredTransfers = pendingTransfers?.filter((transfer) => {
    const employeeName = transfer.employee?.employeeName || "";
    const fromOfficeName = transfer.fromOffice?.officeName || "";
    const toOfficeName = transfer.toOffice?.officeName || "";
    const status = transfer.status || "";
    return (
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fromOfficeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      toOfficeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  console.log("filteredTransfers",filteredTransfers)

  return (
    <div className="min-h-screen pb-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
          <ArrowLeftRightIcon className="w-8 h-8 text-primary" />
          Transfer Requests (Main Admin)
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-600">
          Review and update transfer requests.
        </p>
      </header>
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-primary">
          <div className="relative flex-1">
            <SearchIcon className="w-5 h-5 text-gray-400 absolute top-3 left-3" />
            <input
              type="text"
              placeholder="Search transfers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">Error loading transfer requests</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Current Office
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Requested Office
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Created On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransfers.length > 0 ? (
                  [...filteredTransfers]
                  .sort((a, b) => (a.employee?.fullName || "").localeCompare(b.employee?.fullName || ""))
                  .map((transfer) => (
                    <tr key={transfer._id}>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.employee?.fullName || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.fromOffice?.officeName || "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {transfer.toOffice?.officeName || "N/A"}
                      </td>
                      <td className={`px-6 py-3 text-sm font-semibold ${
                        transfer.status === "Pending"
                          ? "text-yellow-500"
                          : transfer.status === "CEOApproved"
                          ? "text-green-500"
                          : transfer.status === "Approved"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}>
                        {transfer.status}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {new Date(transfer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedTransfer(transfer)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No transfer requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
            <div className="flex flex-col gap-10 ">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Employee ID:</strong> {selectedTransfer.employee?.employeeId}</div>
              <div><strong>Employee Name:</strong> {selectedTransfer.employee?.fullName}</div>
              <div><strong>From Office:</strong> {selectedTransfer.fromOffice?.officeName}</div>
              <div><strong>To Office:</strong> {selectedTransfer.toOffice?.officeName}</div>
              <div><strong>Transfer Reason:</strong> {selectedTransfer.transferReason}</div>
              <div><strong>Transfer Date:</strong> {new Date(selectedTransfer.transferDate).toLocaleDateString()}</div>
              <div><strong>Transfer Order No:</strong> {selectedTransfer.transferOrderNo}</div>
              <div><strong>Transfer Order Date:</strong> {new Date(selectedTransfer.transferOrderDate).toLocaleDateString()}</div>
              <div><strong>Transfer Type:</strong> {selectedTransfer.transferType}</div>
              <div>
                <strong>Transfer Order File:</strong>{" "}
                <button onClick={() => setIsPdfView(true)} className="text-blue-500 hover:underline">
                  View Document
                </button>
              </div>
            </div>
            
            <div className="flex-wrap flex justify-end gap-4">
                <button
                  onClick={() => handleApprove(selectedTransfer._id)}
                  className="flex items-center gap-1 bg-green-500 hover:bg-green-600 transition text-white px-3 py-1 rounded text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedTransfer._id)}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded text-sm font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
          {selectedTransfer.transferOrder && isPdfView && (
        <div className="my-4 overflow-auto h-[500px]">
          <PdfPreview url={selectedTransfer.transferOrder} />
        </div>
      )} 
        </div>
      )}
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

      

    </div>
  );
}