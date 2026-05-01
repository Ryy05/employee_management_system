"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/api/axiosClient";
import { useUser } from "@/context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQueryClient } from "@tanstack/react-query";
import ViewZones from "./ViewZones";

const AddZone = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useUser();
  const districtId = user?.districtId;
  
  const [zoneName, setZoneName] = useState("");

  const [zeoUserName, setZeoUserName] = useState("");
  const [zeoPassword, setZeoPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [zonalOfficeId, setZonalOfficeId] = useState("");
  const [zonalOfficeName, setZonalOfficeName] = useState("");
  const [zonalOfficeType, setZonalOfficeType] = useState("Administrative");
  const [officeContact, setOfficeContact] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };


  useEffect(() => {
    if (zoneName) {
      const formattedName = zoneName.trim().toLowerCase().replace(/\s+/g, '_');
      setZeoUserName(`zeo_${formattedName}`);
      setZeoPassword(generatePassword());
      setZonalOfficeName(`Zonal Education Office - ${zoneName}`);
      
    }
  }, [zoneName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!zoneName) {
      setError("Zone name is required.");
      return;
    }
    if (!districtId) {
      setError("Your district information is missing. Please contact the administrator.");
      return;
    }
    if (!zeoUserName || !zeoPassword) {
      setError("ZEO Username and Password are required.");
      return;
    }
    if ( !zonalOfficeName) {
      setError("Zonal Office ID and Name are required.");
      return;
    }
    if (!zoneName || !zonalOfficeName) {
        setError("All fields are required.");
        return;
      }


    const payload = {
      name: zoneName,
      district: districtId,
      zeoUserName,
      zeoPassword,
      zonalOffice: {
        officeName: zonalOfficeName,
        officeType: zonalOfficeType,
        contact: officeContact,
        address: officeAddress,
      },
      user
    };

    try {
      const response = await axiosClient.post("/zones", payload);
      if (response.status === 201) {
        setSuccess("Zone and ZEO user created successfully!");
        toast.success("Zone and ZEO user created successfully!");
        setZoneName("");
        setZeoUserName("");
        setZeoPassword("");
        setZonalOfficeName("");
        setOfficeContact("");
        setOfficeAddress("");
        setIsModalOpen(false);
        queryClient.invalidateQueries(["zones"]);

      }
    } catch (error) {
      console.error("Error creating zone:", error.response?.data || error.message);
      setError(
        error.response?.data?.message ||
          "Failed to create zone. Make sure the zone name is unique within the district."
      );
    }
  };

  return (
    <div className="flex flex-col items-end">
  <ToastContainer />
  {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-40 text-sm font-normal backdrop-blur-sm flex justify-center items-center z-50">
       <div className="bg-white p-8  shadow-2xl max-w-xl max-h-[90vh] w-full overflow-y-auto">
       <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Zone</h2>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        {success && <div className="mb-4 text-green-500 text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Zone Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Zone Name</label>
            <input
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter zone name"
              required
            />
          </div>

          <div className="space-y-3 pt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">ZEO Credentials</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">ZEO Username</label>
              <input
                type="text"
                value={zeoUserName}
                onChange={(e) => setZeoUserName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ZEO Password</label>
              <input
                type="text"
                value={zeoPassword}
                onChange={(e) => setZeoPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Zonal Office Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Office Name</label>
              <input
                type="text"
                value={zonalOfficeName}
                onChange={(e) => setZonalOfficeName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter zonal office name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact</label>
              <input
                type="text"
                value={officeContact}
                onChange={(e) => setOfficeContact(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter office contact number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter office address"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Add Zone
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              type="button"
              className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

<ViewZones />

  <button
    onClick={() => setIsModalOpen(true)}
    className=" bg-blue-600 px-4 text-sm mt-10 font-medium  text-white py-2 rounded hover:bg-blue-700 transition "
  >
    Add New Zone
  </button>

  
</div>


  );
};

export default AddZone;
