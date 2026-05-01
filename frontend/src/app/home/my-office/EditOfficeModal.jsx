"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditOfficeModal({ office, isOpen, onClose, onOfficeUpdate }) {
  const [officeData, setOfficeData] = useState(office || {});
  const [schoolDetails, setSchoolDetails] = useState(
    office?.officeType === "Educational" && office.schools?.length > 0
      ? office.schools[0]
      : {}
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (office) {
      setOfficeData(office);
      if (office.officeType === "Educational" && office.schools?.length > 0) {
        setSchoolDetails(office.schools[0]);
      } else {
        setSchoolDetails({});
      }
    }
  }, [office]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setOfficeData({ ...officeData, [name]: val });
  };

  const handleSchoolChange = (e) => {
    const { name, value } = e.target;
    setSchoolDetails({ ...schoolDetails, [name]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload =
        officeData.officeType === "Educational"
          ? { ...officeData, schools: [schoolDetails] }
          : officeData;

          console.log("Sending Payload:", payload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/offices/${office._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Server Response:", data);
      if (response.ok) {
        toast.success("Office details updated successfully!");
        onOfficeUpdate(data.office);
        onClose();
      } else {
        toast.error(data.message || "Error updating office details");
      }
    } catch (error) {
      toast.error("Error updating office details");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 text-sm font-normal backdrop-blur-sm flex justify-center items-center z-50">
  <ToastContainer />
  <div className="bg-white p-8  shadow-2xl max-w-xl max-h-[90vh] w-full overflow-y-auto">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Office Details</h2>
    <div className="space-y-5">

      {/* Office Fields */}
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Office Name</label>
          <input
            type="text"
            name="officeName"
            value={officeData.officeName || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Office Type</label>
          <input
            readOnly
            type="text"
            name="officeType"
            value="Administrative"
            className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2 mt-1 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Address</label>
          <input
            type="text"
            name="address"
            value={officeData.address || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Contact</label>
          <input
            type="text"
            name="contact"
            value={officeData.contact || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* DDO Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isDdo"
          checked={officeData.isDdo || false}
          onChange={(e) =>
            handleChange({
              target: { name: "isDdo", value: e.target.checked },
            })
          }
          className="w-4 h-4 accent-blue-500"
        />
        <label className="text-gray-700 text-sm">Has DDO</label>
      </div>

      {/* DDO Fields */}
      {officeData.isDdo && (
        <div className="grid gap-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">DDO ID</label>
            <input
              type="text"
              name="ddoOfficerId"
              value={officeData.ddoOfficerId || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">DDO Code</label>
            <input
              type="text"
              name="ddoCode"
              value={officeData.ddoCode || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>
      )}

      
      <div>
        <label className="block text-sm font-medium text-gray-600">Parent Office ID (optional)</label>
        <input
          type="text"
          name="parentOffice"
          value={officeData.parentOffice || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      
      {officeData.officeType === "Educational" && (
        <div className="border-t pt-5 mt-5">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">School Details</h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">School Name</label>
              <input
                type="text"
                name="name"
                value={schoolDetails.name || ""}
                onChange={handleSchoolChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">UDISe ID</label>
              <input
                type="text"
                name="udiseId"
                value={schoolDetails.udiseId || ""}
                onChange={handleSchoolChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Feasibility Zone</label>
              <input
                type="text"
                name="feasibilityZone"
                value={schoolDetails.feasibilityZone || ""}
                onChange={handleSchoolChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Admin Username</label>
              <input
                type="text"
                name="adminUserName"
                value={schoolDetails.adminUserName || ""}
                onChange={handleSchoolChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Admin Password</label>
              <input
                type="text"
                name="adminPassword"
                value={schoolDetails.adminPassword || ""}
                onChange={handleSchoolChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t mt-6">
        <button
          onClick={onClose}
          className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-5 py-2 rounded-lg transition text-white ${
            isSaving ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  </div>
</div>


  );
}
