"use client";

import { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ViewZones = () => {
  const [zonalOffices, setZonalOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (searchTerm) {
      const filtered = zonalOffices.filter((office) =>
        office.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOffices(filtered);
    } else {
      setFilteredOffices(zonalOffices);
    }
  }, [searchTerm, zonalOffices]);

  const handleViewDetails = (zoneId) => {
    router.push(`/home/subordinate-office/zone?zoneId=${zoneId}`);
  };

  const {
    data: zones = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      const response = await axiosClient.get("/zones");
      return response.data.zones || [];
    },
  });

  useEffect(() => {
    if (zones.length > 0) {
      setZonalOffices(zones);
      setFilteredOffices(zones);
      console.log("Zonal Offices:", zones);
    }
  }, [zones]);

  useEffect(() => {
    if (isError) {
      toast.error("Error fetching zonal offices");
    }
  }, [isError]);

  console.log("filteredOffices:", filteredOffices);

  return (
    <div className="w-full capitalize">
      <ToastContainer />

      <div className="flex w-full justify-between items-center bg-white border-l-[3px] border-primary p-6 rounded-lg shadow-sm transition duration-300 mb-8 text-sm">
        <div className="flex items-center gap-3">
          <Building2 className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold text-secondary">
            View All Zonal Offices
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
                Zone Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zonal Office
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...filteredOffices]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((zone) => (
                <tr key={zone._id} className="">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {zone.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {zone.district?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {zone.offices?.length > 0
                      ? zone.offices
                          .filter((office) => office._id === zone.myOffice) // Filter for matching office
                          .map((office, index) => (
                            <div key={index}>
                              <span className="">
                                {office.officeName ||
                                  "Office Name Not Available"}
                              </span>
                            </div>
                          ))
                      : "No offices linked"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleViewDetails(zone._id)}
                      className="py-1 px-3 bg-primary text-white rounded-full font-medium text-xs hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            {filteredOffices.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No zonal offices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewZones;
