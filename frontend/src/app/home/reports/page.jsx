"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { File } from "lucide-react";
import { useUser } from "@/context/UserContext";
import axiosClient from "@/api/axiosClient";

export default function StaffStatementDownloadPage() {

  const [zones, setZones] = useState([]);
const [schools, setSchools] = useState([]);
const [selectedZoneId, setSelectedZoneId] = useState("");
const { user } = useUser();
const userRole = user?.role;
const schoolId = userRole === "schoolAdmin" ? user?.schoolId || "" : "";
const [selectedSchoolId, setSelectedSchoolId] = useState(schoolId);
const [reportType, setReportType] = useState(
  userRole === "schoolAdmin" ? "school-employees" : "zones-schools"
);
const [loadingZones, setLoadingZones] = useState(false);
const [loadingSchools, setLoadingSchools] = useState(false);

console.log("userROle", userRole);

useEffect(() => {
  if ((userRole === "CEO" || userRole === "ZEO") && user) {
    fetchZones();
  }
}, [userRole, user]);


const fetchZones = async () => {
  try {
    const response = await axiosClient.get("/zones");
    console.log("response", response);
    setZones(response.data.zones);
    if (userRole === "ZEO") {
      const zone = response.data.zones.find((z) => z._id === user.zoneId);
      if (zone) {
        setSelectedZoneId(zone._id);
        fetchSchools(zone._id);
      }
    }
  } catch (error) {
    console.error("Failed to fetch zones", error);
  }
};

const fetchSchools = async (zoneId) => {
  try {
    const response = await axiosClient.get(`/schools/zone/${zoneId}`); // Use axiosClient here
    setSchools(response.data); // Using axiosClient, response.data contains the data
    console.log("response", response.data);
  } catch (error) {
    console.error("Failed to fetch schools", error);
  }
};


useEffect(() => {
  if (selectedZoneId) {
    fetchSchools(selectedZoneId);
  }
}, [selectedZoneId]);


const downloadExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, fileName);
};




  


const handleDownload = async () => {
  let url = "";
  if (reportType === "zones-schools") {
    url = `/reports/schools`; // Use relative path as axiosClient already has the base URL
    if (userRole === "ZEO") url += `?zoneId=${user.zoneId}`;
    if (userRole === "CEO" && selectedZoneId) url += `?zoneId=${selectedZoneId}`;
  }

  if (reportType === "school-employees") {
    url = `/reports/employees`;
    if (selectedSchoolId) {
      url += `?schoolId=${selectedSchoolId}`;
    } else if (selectedZoneId) {
      url += `?zoneId=${selectedZoneId}`;
    }
  }

  try {
    const response = await axiosClient.get(url);
    let rawData = response.data;

    // 💡 Only transform employee data to include officeName
    if (reportType === "school-employees") {
      rawData = rawData.map(({ office, ...rest }) => ({
        ...rest,
        officeName: office?.officeName || "",
      }));
    }
    const filename = reportType === "zones-schools" ? "Schools_Report.xlsx" : "Employees_Report.xlsx";
    downloadExcel(rawData, filename); // You control Excel creation on client
  } catch (error) {
    console.error("Error downloading report", error);
  }
};








  return (
    <div className="min-h-screen capitalize">
      <div>
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            <File className="w-8 h-8 text-primary" /> Reports Download
          </h1>
          <p className="mt-2 font-medium text-sm text-gray-600">
            Download Excel Reports for Schools and their Staff Members
          </p>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-l-[3px] border-primary">
          <div className="flex-1 mb-6 w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Report Type:</label>
            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setSelectedZoneId("");
                setSelectedSchoolId("");
              }}
              
              
              className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm "
            >

              {userRole !== "schoolAdmin"&&<option value="zones-schools">Zones & Schools Report</option>}
              <option value="school-employees"> Staff Statement Report</option>
            </select>
          </div>
          
          {/* Zone Selection */}
{userRole === "CEO" && (
  <div className="flex-1 mb-6 w-1/3">
    <label className="block text-sm font-medium text-gray-700 mb-1">Select Zone:</label>
    <select
      value={selectedZoneId || "All Zones"} // If selectedZoneId is empty, set default to "All Zones"
      onChange={(e) => {
        const selectedValue = e.target.value;
        setSelectedZoneId(selectedValue === "All Zones" ? "" : selectedValue); // Set empty if "All Zones"
        setSelectedSchoolId(""); // Reset school selection when zone changes
      }}
      className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
    >
      <option value="All Zones">All Zones</option>
      {zones?.map((zone) => (
        <option key={zone._id} value={zone._id}>
          {zone.name}
        </option>
      ))}
    </select>
  </div>
)}

{/* School Selection */}
{reportType === "school-employees" && userRole !== "schoolAdmin" && (
  <div className="flex-1 mb-6 w-1/3">
    <label className="block text-sm font-medium text-gray-700 mb-1">Select School:</label>
    <select
      value={selectedSchoolId || "All Schools"} // If selectedSchoolId is empty, set default to "All Schools"
      onChange={(e) => {
        const selectedValue = e.target.value;
        setSelectedSchoolId(selectedValue === "All Schools" ? "" : selectedValue); // Set empty if "All Schools"
      }}
      className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
    >
      <option value="All Schools">All Schools</option>
      {schools.map((school) => (
        <option key={school._id} value={school._id}>
          {school.office.officeName} ({school.udiseId})
        </option>
      ))}
    </select>
  </div>
)}


         
          <button
            onClick={handleDownload}
            className="px-4 py-2 mt-4 transition bg-blue-500 font-semibold text-sm text-white rounded hover:bg-blue-600"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
