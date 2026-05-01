"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/api/axiosClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "@/context/UserContext";
import { Building2 } from "lucide-react";

const ViewOffice = () => {
  const [zoneDetails, setZoneDetails] = useState(null);
  const [offices, setOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const zoneId = user?.zoneId;

  // Fetch Zone Details
  useEffect(() => {
    const fetchZoneDetails = async () => {
      try {
        const response = await axiosClient.get(`/zones/${zoneId}`);
        console.log(response.data);
        setZoneDetails(response.data.zone);
        setOffices(response.data.zone.offices);
      } catch (error) {
        toast.error("Error fetching zone details");
      }
    };

    if (zoneId) {
      fetchZoneDetails();
    }
  }, [zoneId]);

  // Filter Offices based on search term
  useEffect(() => {
    if (searchTerm) {
      let filtered = offices.filter((office) =>
        office.officeName.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (user.role === "ZEO" && user.officeId) {
        filtered = filtered.filter((office) => office._id !== user.officeId);
      }
      setFilteredOffices(filtered);
    } else {
      let filtered = offices;
      if (user.role === "ZEO" && user.officeId) {
        filtered = filtered.filter((office) => office._id !== user.officeId);
      }

      setFilteredOffices(filtered);
    }
  }, [searchTerm, offices, user.role, user.officeId]);

  const handleViewOffice = (office) => {
    if (office.officeType === "Educational" && office.schools?.length > 0) {
      router.push(`/home/school-status?school=${office.schools[0]._id}`);
    } else {
      router.push(`/home/office?officeId=${office._id}`);
    }
  };

  if (!zoneDetails)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="w-full capitalize">
      <ToastContainer />

      <div className="flex w-full justify-between items-center bg-white border-l-[3px] border-primary p-6 rounded-lg shadow-sm transition duration-300 mb-8 text-sm">
        <div className="flex items-center gap-3">
          <Building2 className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold text-secondary">
            Zone : {zoneDetails.name}
          </h1>
        </div>
        <div className=" mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search by Zone Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block  border-gray-300 min-w-52 rounded-md py-2 px-2 text-sm border"
          />
        </div>
      </div>
      <div className="bg-white rounded-lg overflow-x-auto border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Office Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Office Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...(filteredOffices || [])]
              .sort((a, b) => a.officeName.localeCompare(b.officeName))
              .map((office) => (
                <tr key={office._id} className="">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {office.officeName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {office.officeType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <button
                      onClick={() => handleViewOffice(office)}
                      className="py-1 px-3 bg-primary text-white rounded-full font-medium text-xs hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewOffice;
