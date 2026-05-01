"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar as LucideCalendar,
  CheckCircle,
  XCircle,
  User,
  Building,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/dateUtils";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useUser } from "@/context/UserContext";

import "@/styles/customCalendar.css"

// Dummy employee/user data
const fetchEmployeeData = async (employeeId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/${employeeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  console.log("Fetched Data (Inside fetchEmployeeData):", data);
  if (!response.ok) {
    throw new Error("Failed to fetch employee data");
  }

  return data; // Make sure this matches the format expected by your React Query hook
};






const fetchTransferHistory = async (employeeId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transferHistory/${employeeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transfer history");
  }
  const data = await response.json();
  setTransferHistory(data.history);
};


export default function StaffDashboard() {
  const [profile, setProfile] = useState({});

  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [transferHistory, setTransferHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useUser();
  console.log("User:", user);
  const employeeId = user?.employeeId;

  

  const {
    data: employeeData,
    isLoading: employeeLoading,
    error: employeeError,
  } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => fetchEmployeeData(employeeId),
    refetchOnWindowFocus: false,
  });
  
  // Using useEffect to ensure state updates when data is available
  useEffect(() => {
    if (employeeData) {
      console.log("Fetched Employee Data (Inside useEffect):", employeeData);
      setProfile(employeeData); // Ensure this matches the data format
    }
  }, [employeeData]);
  
  
    
  

  const attendanceMap = attendanceHistory.reduce((acc, record) => {
    acc[record.date] = record.status;
    return acc;
  }, {});
  

  const getTileClassName = ({ date, view }) => {
    if (view === "month") {
      // Format date to YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      const status = attendanceMap[dateString];

      if (status === "Present") return "calendar-present";
      if (status === "Absent") return "calendar-absent";
      if (status === "Leave") return "calendar-leave";
    }
    return "";
  };
  

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-primary">
<div className="flex items-center gap-4">
<User className="w-12 h-12 text-blue-500" />
<div className="space-y-1">
  <h2 className="text-2xl font-bold text-gray-800">
    {profile.fullName}
  </h2>
  <p className="text-gray-500 text-sm font-medium">
    Employee ID: {profile.employeeId}
  </p>
  <p className="text-gray-500 text-sm font-medium capitalize">
    Present Designation: {profile.presentDesignation}
  </p>
</div>
</div>

{/* Multi-column layout for profile details */}
<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-600 font-medium">
<div className="space-y-3">
  <p>
    <strong className="mr-1">Gender:</strong> {profile.gender || "N/A"}
  </p>
  <p>
    <strong className="mr-1">Marital Status:</strong> {profile.maritalStatus || "N/A"}
  </p>
  <p>
    <strong className="mr-1">Spouse/Parentage:</strong> {profile.parentageOrSpouse || "N/A"}
  </p>
  <p>
    <strong className="mr-1">Date of Birth:</strong> {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "N/A"}
  </p>
  <p>
    <strong className="mr-1">Date of First Appointment:</strong> {profile.dateOfFirstAppointment ? new Date(profile.dateOfFirstAppointment).toLocaleDateString() : "N/A"}
  </p>
</div>

<div className="space-y-3">
  <p>
    <strong className="mr-1">Designation at First Appointment:</strong> {profile.designationAtFirstAppointment || "N/A"}
  </p>
  <p>
    <strong className="mr-1">Date of Recent Promotion:</strong> {profile.dateOfRecentPromotion ? new Date(profile.dateOfRecentPromotion).toLocaleDateString() : "N/A"}
  </p>
  <p>
    <strong className="mr-1">Date of Current Posting:</strong> {profile.dateOfCurrentPosting ? new Date(profile.dateOfCurrentPosting).toLocaleDateString() : "N/A"}
  </p>
  <p>
    <strong className="mr-1">Actual Place of Posting:</strong> {profile.actualPlaceOfPosting || "N/A"}
  </p>
  <p>
    <strong className="mr-1">Basis of Work:</strong> {profile.basisOfWork || "N/A"}
  </p>
  <p>
    <strong className="mr-1">Highest Qualification:</strong> {profile.highestQualification || "N/A"}
  </p>
</div>

<div className="space-y-3">
  <p>
    <strong className="mr-1">Specialization Subject:</strong> {profile.specializationSubject || "N/A"}
  </p>
  <p>
    <strong className="mr-1">B.Ed:</strong> {profile.bed ? "Yes" : "No"}
  </p>
  <p>
    <strong className="mr-1">Pension Scheme:</strong> {profile.pensionScheme || "N/A"}
  </p>
  <p>
    <strong className="mr-1">Phone Number:</strong> {profile.phoneNo || "N/A"}
  </p>
  <p>
    <strong className="mr-1">Email:</strong> {profile.email || "N/A"}
  </p>
</div>
</div>
</div>


        

        {/* Transfer History Timeline */}
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-primary font-medium">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Transfer History
          </h3>
          <p className="text-gray-500 text-sm mb-8">
            Your transfer requests in a timeline
          </p>
          <div className="relative border-l-[3px] border-dashed border-gray-300 ml-6 text-sm">
            {transferHistory.map((transfer, index) => (
              <div key={index} className="mb-10 ml-8 flex">
                <span className="flex absolute -left-[19px] justify-center items-center p-2 rounded-full bg-blue-100 ring-2 ring-primary">
                  <Building className="w-5 h-5 text-blue-600" />
                </span>
                <div className="flex flex-col gap-y-1">
                  <time className="block mb-2 text-xs font-semibold leading-none text-gray-400">
                    {transfer.date}
                  </time>
                  <h3 className="text-[15px] font-semibold text-gray-900">
                    {transfer.from} &rarr; {transfer.to}
                  </h3>
                  <p className="text-[13px] font-medium text-gray-500">
                    Status: {transfer.status} | Reason: {transfer.reason}
                  </p>
                </div>
              </div>
            ))}
            {transferHistory.length === 0 && (
              <div className="mb-10 ml-6 text-gray-500">
                No transfer records found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
