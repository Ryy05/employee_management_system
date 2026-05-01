"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  LayoutDashboard,
  School as SchoolIcon,
  Users,
  ArrowLeftRight,
  BookOpen,
  BriefcaseBusinessIcon,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import axiosClient from "@/api/axiosClient";


const fetchEmployeesByRole = async (role, zoneId, officeId) => {
  try {
    if (role === "CEO") {
      const res = await axiosClient.get("/employees");
      return Array.isArray(res.data) ? res.data : res.data.employees || [];
    } else if (role === "ZEO" && zoneId) {
      const res = await axiosClient.get(`/zones/${zoneId}/employees`);
      console.log("Zone employees response:", res.data.employees);
      return  res.data.employees ;
    } else if (role === "schoolAdmin" && officeId) {
      const res = await axiosClient.get(`/employees/office/${officeId}`);
      return Array.isArray(res.data) ? res.data : res.data.employees || [];
    } else {
      return [];
    }
  } catch (err) {
    console.error("Error fetching employee data:", err);
    return [];
  }
};





// Fetch all transfers (to compute pending transfers)
// const fetchTransfers = async () => {
//   try {
//     const res = await axiosClient.get("/transfers");
//     console.log("Transfers response:", res.data);
//     return Array.isArray(res.data?.transferRequests)
//       ? res.data.transferRequests
//       : res.data?.transferRequests || [];
//   } catch (error) {
//     console.error("Error fetching transfers:", error);
//     return [];
//   }
// };




const fetchEnrollmentTrends = async () => {
  return [
    { year: "2018", students: 1200 },
    { year: "2019", students: 1300 },
    { year: "2020", students: 1400 },
    { year: "2021", students: 1600 },
    { year: "2022", students: 1800 },
    { year: "2024", students: 2200 },
  ];
};


const fetchRecentActivities = async () => {
  try {
    const res = await axiosClient.get("/logs");
    return res?.data?.logs?.slice(0, 3) || [];
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
};

// Fetch retirement employees based on filterDays; expects endpoint with query param.
// const fetchRetirements = async (days) => {
//   const res = await axiosClient.get(`/employees/retirements?days=${days}`);
//   return res.data.retirements || []; // Ensure fallback to an empty array
// };

const fetchSchools = async (role, districtId, zoneId, officeId) => {
  try {
    let response;

    if (role === "CEO" && districtId) {
      response = await axiosClient.get(`/schools/district/${districtId}`);
    } else if (role === "ZEO" && zoneId) {
      response = await axiosClient.get(`/schools/zone/${zoneId}`);
    } else if (role === "schoolAdmin" && officeId) {
      response = await axiosClient.get(`/schools/office/${officeId}`);
    } else {
      console.warn("Invalid role or missing parameters in fetchSchools.");
      return [];
    }

  
    if (
      response.data &&
      typeof response.data === "object" &&
      response.data.message?.toLowerCase().includes("no schools found")
    ) {
      return [];
    }


    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.schools)) {
      return response.data.schools;
    } else {
      return [];
    }
  } catch (error) {
    console.warn("Error fetching schools:", error?.response?.data?.message || error.message);
    return []; 
  }
};


export default function ZonalAdminDashboard() {
  const [filterDays, setFilterDays] = useState(30);
  const { userRole, user } = useUser();  
  const userDistrictId = user?.districtId;
  const userZoneId = user?.zoneId;
  const userOfficeId = user?.officeId;


  const { data: schools = [], error, isLoading } = useQuery({
    queryKey: ["schools", userRole, userDistrictId, userZoneId, userOfficeId],
    queryFn: () => fetchSchools(userRole, userDistrictId, userZoneId, userOfficeId),
    onError: (error) => {
      console.error("Failed to fetch schools:", error);
    },
    retry: false,
  });

  const { data: employeeData = [] } = useQuery({
      queryKey: ["employees", userRole, userZoneId, userOfficeId],
      queryFn: () => fetchEmployeesByRole(userRole, userZoneId, userOfficeId),
    });

    console.log("Employee Data:", employeeData);
  
  const { data: enrollmentData = [] } = useQuery({
    queryKey: ["enrollmentTrends"],
    queryFn: fetchEnrollmentTrends,
    retry: false,
  });
  
  const { data: recentActivities = [] } = useQuery({
    queryKey: ["recentActivities"],
    queryFn: fetchRecentActivities,
    // Don't retry on error
    retry: false,
  });
  // const { data: retirementEmployees = [] } = useQuery({
  //   queryKey: ["retirements", filterDays],
  //   queryFn: () => fetchRetirements(filterDays),
  //   keepPreviousData: true,
  // });


  const safeSchools = Array.isArray(schools) ? schools : [];
  const totalSchools = safeSchools.length;
  const totalStudents = safeSchools.reduce(
    (acc, school) => acc + (school.numberOfStudents || 0),
    0
  );
  const totalStaff = Array.isArray(employeeData) ? employeeData.length : 0;

  


  // const safeTransfers = Array.isArray(transfers) ? transfers : [];
  // const pendingTransfers = safeTransfers.filter((t) => t.status === "pending").length;


  // Staff distribution: count based on staffType.
  const safeEmployees =
  Array.isArray(employeeData) ? employeeData : [];

  console.log("Safe Employees:", safeEmployees);

const teachingCount = safeEmployees.filter(
  (emp) => emp.staffType?.toLowerCase() === "teaching"
).length;

const nonTeachingCount = safeEmployees.filter(
  (emp) => emp.staffType?.toLowerCase() === "non-teaching"
).length;

  
  const staffData = [
    { name: "Teaching", value: teachingCount },
    { name: "Non-Teaching", value: nonTeachingCount },
  ];
  const COLORS = ["#0088FE", "#00C49F"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
              <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
            </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
        {/* Total Schools */}
        {user.role !== "schoolAdmin" && <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
          <div className="flex items-center space-x-2">
            <SchoolIcon className="h-5 w-5 text-blue-500" />
            <h3 className="text-[15px] font-semibold text-gray-800">
              Total Schools
            </h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">
            Number of schools 
          </p>
          <div className="text-2xl font-bold text-gray-800">
            {totalSchools}
          </div>
        </div>}

        {/* Total Employees */}
        
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-500" />
            <h3 className="text-[15px] font-semibold text-gray-800">
              Total Employees
            </h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">
            Teaching & Non-Teaching staff
          </p>
          <div className="text-2xl font-bold text-gray-800">
            {totalStaff}
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-yellow-500" />
            <h3 className="text-[15px] font-semibold text-gray-800">
              Teaching Staff
            </h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">
            Total Teaching staff
          </p>
          <div className="text-2xl font-bold text-gray-800">
            {teachingCount}
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
          <div className="flex items-center space-x-2">
            <BriefcaseBusinessIcon className="h-5 w-5 text-orange-500" />
            <h3 className="text-[15px] font-semibold text-gray-800">
            Non-Teaching staff
            </h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">
            Total Non-Teaching staff
          </p>
          <div className="text-2xl font-bold text-gray-800">
            {nonTeachingCount}
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5 text-purple-500" />
            <h3 className="text-[15px] font-semibold text-gray-800">
              Total Students
            </h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">
            Current enrollment
          </p>
          <div className="text-2xl font-bold text-gray-800">
            {totalStudents}
          </div>
        </div>

        {/* Pending Transfers */}
        {/* <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="h-5 w-5 text-orange-500" />
            <h3 className="text-[15px] font-semibold text-gray-800">
              Pending Transfers
            </h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">
            Awaiting approval
          </p>
          <div className="text-2xl font-bold text-gray-800">
            {pendingTransfers}
          </div>
        </div> */}
      </div>

      {/* Charts Section */}
      <div className="flex gap-x-4 w-full">
        {/* Enrollment Trends (Line Chart) */}
        <div className="bg-white shadow-sm rounded-lg p-4 w-3/5">
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            Enrollment Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 14, fill: "#0d2745", style: { fontWeight: "600" } }}
                tickLine={{ stroke: "#377DFF" }}
              />
              <YAxis
                tick={{ fontSize: 14, fill: "#0d2745", style: { fontWeight: "600" } }}
                tickLine={{ stroke: "#377DFF" }}
              />
              <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", color: "#fff", fontSize: "14px" }} itemStyle={{ color: "#377DFF" }} />
              <Legend wrapperStyle={{ fontSize: "14px", color: "#377DFF" }} />
              <Line type="monotone" dataKey="students" stroke="#377DFF" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Staff Distribution (Pie Chart) */}
        <div className="bg-white shadow-sm rounded-lg p-4 w-2/5">
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            Staff Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={staffData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {staffData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", color: "#fff", fontSize: "14px" }} itemStyle={{ color: "#fff" }} />
              <Legend wrapperStyle={{ fontSize: "14px", color: "#377DFF", fontWeight: "500" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow-sm rounded-lg p-4 border-l-[3px] border-primary">
  <h3 className="text-xl font-bold mb-4 text-gray-800">
    Recent Activities
  </h3>
  <div className="divide-y divide-gray-200 mt-2">
    {recentActivities.map((activity, index) => (
      <div key={index} className="py-2">
        {/* Main row: action and time */}
        <div className="flex items-center justify-between text-sm font-medium text-gray-600">
          <span>{activity.action}</span>
          <span className="text-gray-400 text-[13px]">{activity.time}</span>
        </div>
        {/* Secondary row: additional details (if any) */}
        {(activity.description || activity.admin || activity.ip) && (
          <div className="mt-1 text-xs text-gray-500">
            {activity.description && <span>{activity.description}</span>}
            {activity.admin && (
              <span className="ml-2">
                {activity.admin}
                {activity.role && ` (${activity.role})`}
              </span>
            )}
            {activity.ip && <span className="ml-2">IP: {activity.ip}</span>}
          </div>
        )}
      </div>
    ))}
  </div>
  <div className="mt-4 text-right">
    <Link
      href="/home/logs"
      className="text-blue-600 font-semibold hover:underline text-sm"
    >
      View All Logs
    </Link>
  </div>
</div>




      {/* Retirement Announcements - Employee Retirement Table with Filter */}
      {/* <div className="bg-white shadow-sm rounded-lg p-4 border-l-[3px] border-primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
            Retirement Announcements
          </h3>
          <div className="flex items-center space-x-2">
            <label htmlFor="filter" className="text-sm text-gray-700">
              Show retirements in next (days):
            </label>
            <input
              type="number"
              id="filter"
              value={filterDays}
              onChange={(e) => setFilterDays(Number(e.target.value))}
              className="w-16 border border-gray-300 rounded p-1 text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Employee ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Designation</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date of Retirement</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {retirementEmployees.map((emp) => (
                <tr key={emp.emp_id}>
                  <td className="px-4 py-2 text-sm text-gray-800">{emp.emp_id}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{emp.emp_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{emp.present_designation}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{emp.date_of_retirement}</td>
                  <td>
                    <Link href={`/home/school-status/${emp.school_id}/${emp.emp_id}`}>
                      <button className="py-1 px-3 bg-primary text-white rounded-full font-medium text-xs hover:bg-blue-600 transition">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {retirementEmployees.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-sm text-gray-700 text-center">
                    No retirements within the next {filterDays} days.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
