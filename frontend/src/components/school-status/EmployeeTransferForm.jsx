import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import axiosClient from "@/api/axiosClient";
import { useUser } from "@/context/UserContext";
import { createTransferRequest } from "@/api/transferService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function TransferRequestForm({ onCancel, employeeId }) {
  const [transferType, setTransferType] = useState("Transfer");
  const [transferDate, setTransferDate] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [transferOrderNo, setTransferOrderNo] = useState("");
  const [transferOrderDate, setTransferOrderDate] = useState("");
  const [transferOrderFile, setTransferOrderFile] = useState(null);
  const [offices, setOffices] = useState([]);
  const [toOfficeId, setToOfficeId] = useState("");
  const { user } = useUser();
  const currentOfficeId = user?.officeId;
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await axiosClient.get("/offices");
        const officeOptions = response.data.offices
          .filter((office) => office._id !== currentOfficeId)
          .map((office) => ({
            label: office.officeName,
            value: office._id,
          }));
        setOffices(officeOptions);
      } catch (err) {
        console.error("Failed to fetch offices:", err);
      }
    };
    fetchOffices();
  }, [currentOfficeId]);

  const transferMutation = useMutation({
    mutationFn: (transferData) =>
      createTransferRequest(transferData, user, window.location.hostname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee"] });
      toast.success("Transfer request submitted successfully");
      onCancel?.();
    },
    onError: (error) => {
      const message = error?.message || "Something went wrong";
      const details = error?.error || "";
      toast.error(`${message}${details ? `: ${details}` : ""}`);
    },    
  });

  const handleSubmit = async () => {
    if (!toOfficeId || !transferDate || !transferType ) {
      toast.error("Please fill all required fields.");
      return;
    }

    let transferOrderUrl = "";
    try {
      if (transferOrderFile) {
        const formData = new FormData();
        formData.append("transferOrder", transferOrderFile);

        const uploadRes = await axiosClient.post("/uploads/upload-transfer-order", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        transferOrderUrl = uploadRes.data.url;
      }

      const payload = {
        employee: employeeId,
        fromOffice: currentOfficeId,
        toOffice: toOfficeId,
        transferType,
        transferDate,
        transferReason,
        transferOrderNo,
        transferOrderDate,
        transferOrder: transferOrderUrl || null,
      };

      transferMutation.mutate(payload);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Error uploading transfer order file");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Transfer Request</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">To Office</label>
        <Select
          options={offices}
          onChange={(selected) => setToOfficeId(selected?.value || "")}
          placeholder="Select destination office"
        />
      </div>

      <label className="block mb-1 text-sm font-medium text-gray-600">Transfer Type</label>
      <select
        value={transferType}
        onChange={(e) => setTransferType(e.target.value)}
        className="border w-full p-2 rounded mb-4"
      >
        <option value="Transfer">Transfer</option>
        <option value="Deputation">Deputation</option>
        <option value="Attachment">Attachment</option>
      </select>

      <label className="block mb-1 text-sm font-medium text-gray-600">Transfer Date</label>
      <input
        type="date"
        value={transferDate}
        onChange={(e) => setTransferDate(e.target.value)}
        className="border w-full p-2 rounded mb-4"
      />

      <label className="block mb-1 text-sm font-medium text-gray-600">Reason</label>
      <textarea
        value={transferReason}
        onChange={(e) => setTransferReason(e.target.value)}
        className="border w-full p-2 rounded mb-4"
        placeholder="Enter reason..."
      ></textarea>

      <label className="block mb-1 text-sm font-medium text-gray-600">Order Number</label>
      <input
        type="text"
        value={transferOrderNo}
        onChange={(e) => setTransferOrderNo(e.target.value)}
        className="border w-full p-2 rounded mb-4"
      />

      <label className="block mb-1 text-sm font-medium text-gray-600">Order Date</label>
      <input
        type="date"
        value={transferOrderDate}
        onChange={(e) => setTransferOrderDate(e.target.value)}
        className="border w-full p-2 rounded mb-4"
      />

      <label className="block mb-1 text-sm font-medium text-gray-600">Upload Order (PDF)</label>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setTransferOrderFile(e.target.files[0])}
        className="border w-full p-2 rounded mb-6"
      />

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!toOfficeId || !transferDate || !transferType}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Transfer
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
