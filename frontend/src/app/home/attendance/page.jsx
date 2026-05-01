// "use client";
// import { useState, useEffect } from "react";
// import { Users, Search, Check, X, AlertTriangle, Briefcase, BookA, UserRoundPenIcon } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify";
// import { User, UserCheck, UserX, UserMinus } from "lucide-react";
// import "react-toastify/dist/ReactToastify.css";
// import { useUser } from "@/context/UserContext";
// import schoolData from "@/data/data.json"; // import your JSON data

// // Define the possible attendance options
// // const attendanceOptions = ["Present", "Absent", "Leave", "On Duty"];

// export default function AttendancePage() {
//   const { user } = useUser();
//   const schoolId = user?.schoolId;
//   console.log("School ID:", schoolId);

//   // Initialize employees as an empty array.
//   const [employees, setEmployees] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [bulkStatus, setBulkStatus] = useState("");
//   const [selectedEmployees, setSelectedEmployees] = useState([]);

//   // useEffect to update employee data when the user (and schoolId) becomes available.
//   useEffect(() => {
//     if (schoolId) {
//       const school =
//         schoolData?.zones
//           .flatMap((zone) => zone.schools)
//           .find((s) => String(s.id) === String(schoolId)) || null;
//       console.log("Found School:", school);
//       if (school) {
//         const initialEmployees = school.employees.map((emp) => ({
//           id: emp.emp_id,
//           name: emp.emp_name,
//           designation: emp.present_designation,
//           school: school.name,
//           status: emp.attendance,
//         }));
//         setEmployees(initialEmployees);
//       }
//     }
//   }, [schoolId]);

//   // Update attendance for an individual employee
//   // const updateAttendance = (id, status) => {
//   //   setEmployees((prev) =>
//   //     prev.map((emp) => (emp.id === id ? { ...emp, status } : emp))
//   //   );
//   //   toast.success(`Attendance marked as ${status} for employee ${id}`, {
//   //     autoClose: 3000,
//   //     toastId: `attendance-toast-${id}`,
//   //   });
//   // };

//   // Handle bulk update
//   const applyBulkUpdate = () => {
//     if (!bulkStatus) {
//       toast.error("Please select an attendance status for bulk update.", { autoClose: 3000 });
//       return;
//     }
//     if (selectedEmployees.length === 0) {
//       toast.error("No employees selected for bulk update.", { autoClose: 3000 });
//       return;
//     }
//     setEmployees((prev) =>
//       prev.map((emp) =>
//         selectedEmployees.includes(emp.id) ? { ...emp, status: bulkStatus } : emp
//       )
//     );
//     toast.success(`Bulk update: Marked selected employees as ${bulkStatus}`, {
//       autoClose: 3000,
//       toastId: "bulk-attendance-toast",
//     });
//     setSelectedEmployees([]);
//   };

//   // Toggle employee selection for bulk action
//   const toggleSelectEmployee = (id) => {
//     setSelectedEmployees((prev) =>
//       prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
//     );
//   };

//   // Filter employees based on search term and attendance status filter
//   const filteredEmployees = employees.filter((emp) => {
//     const matchesSearch =
//       emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       emp.school.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === "" || emp.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   // Map attendance status to a Lucide icon
//   const statusIcon = (status) => {
//     switch (status) {
//       case "Present":
//         return <Check className="w-5 h-5 text-green-500" />;
//       case "Absent":
//         return <X className="w-5 h-5 text-red-500" />;
//       case "Leave":
//         return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
//       case "On Duty":
//         return <Briefcase className="w-5 h-5 text-blue-500" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//       />
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-2xl font-bold text-secondary flex items-center gap-2 mb-6">
//           <BookA className="w-8 h-8 text-primary" /> Attendance Dashboard
//         </h1>

//         {/* Dashboard Metrics */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           {/* Total Employees */}
//           <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
//             <div className="flex items-center space-x-2">
//               <Users className="h-5 w-5 text-purple-700" />
//               <h3 className="text-[15px] font-semibold">Total Employees</h3>
//             </div>
//             <p className="text-[13px] pt-1 text-gray-600">Teaching & Non-Teaching staff</p>
//             <div className="text-2xl font-bold">{employees.length}</div>
//           </div>

//           {/* Present Today */}
//           <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
//             <div className="flex items-center space-x-2">
//               <UserCheck className="h-5 w-5 text-green-500" />
//               <h3 className="text-[15px] font-semibold">Present Today</h3>
//             </div>
//             <p className="text-[13px] pt-1 text-gray-600">Employees currently present</p>
//             <div className="text-2xl font-bold">
//               {employees.filter((emp) => emp.status === "Present").length}
//             </div>
//           </div>

//           {/* Absent Today */}
//           <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
//             <div className="flex items-center space-x-2">
//               <UserX className="h-5 w-5 text-red-500" />
//               <h3 className="text-[15px] font-semibold">Absent Today</h3>
//             </div>
//             <p className="text-[13px] pt-1 text-gray-600">Employees who are absent</p>
//             <div className="text-2xl font-bold">
//               {employees.filter((emp) => emp.status === "Absent").length}
//             </div>
//           </div>

//           {/* On Leave */}
//           <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
//             <div className="flex items-center space-x-2">
//               <UserMinus className="h-5 w-5 text-yellow-500" />
//               <h3 className="text-[15px] font-semibold">On Leave</h3>
//             </div>
//             <p className="text-[13px] pt-1 text-gray-600">Employees on leave today</p>
//             <div className="text-2xl font-bold">
//               {employees.filter((emp) => emp.status === "Leave").length}
//             </div>
//           </div>

//           {/* On Duty */}
//           <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
//             <div className="flex items-center space-x-2">
//               <UserRoundPenIcon className="h-5 w-5 text-blue-500" />
//               <h3 className="text-[15px] font-semibold">On Duty</h3>
//             </div>
//             <p className="text-[13px] pt-1 text-gray-600">Employees on office duty</p>
//             <div className="text-2xl font-bold">
//               {employees.filter((emp) => emp.status === "On Duty").length}
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border-l-[2px] border-primary">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Employees</h2>
//           <div className="flex flex-col sm:flex-row sm:space-x-4">
//             <div className="flex-1 mb-4 sm:mb-0">
//               <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
//                 Search
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
//                 <input
//                   id="search"
//                   type="text"
//                   placeholder="Search by name, designation or school"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 border-gray-300 rounded-md py-2 border px-3 text-sm"
//                 />
//               </div>
//             </div>
//             <div className="flex-1">
//               <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
//                 Filter by Status
//               </label>
//               <select
//                 id="filterStatus"
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="w-full border-gray-300 rounded-md py-2 border px-3 text-sm"
//               >
//                 <option value="">All</option>
//                 {attendanceOptions.map((status, idx) => (
//                   <option key={idx} value={status}>
//                     {status}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Attendance Table */}
//         {/* <div className="bg-white p-6 rounded-lg shadow-sm">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//             <Users className="w-6 h-6 text-primary" /> Employee Attendance
//           </h2>
//           <div className="w-full flex items-center justify-end">
//             <div className="flex items-center mb-6 gap-2">
//               <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4">
//                 <select
//                   id="bulkStatus"
//                   value={bulkStatus}
//                   onChange={(e) => setBulkStatus(e.target.value)}
//                   className="block w-full border-gray-300 rounded-md border py-2 px-2 text-sm"
//                 >
//                   <option value="">-- Select Attendance Status --</option>
//                   {attendanceOptions.map((status, idx) => (
//                     <option key={idx} value={status}>
//                       {status}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <button
//                   className="bg-primary hover:bg-blue-600 transition text-sm font-semibold text-white px-4 py-2 rounded-md"
//                   onClick={applyBulkUpdate}
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-2">
//                     <input
//                       type="checkbox"
//                       checked={
//                         selectedEmployees.length === filteredEmployees.length &&
//                         filteredEmployees.length > 0
//                       }
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedEmployees(filteredEmployees.map((emp) => emp.id));
//                         } else {
//                           setSelectedEmployees([]);
//                         }
//                       }}
//                       className="h-4 w-4"
//                     />
//                   </th>
//                   <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Designation
//                   </th>
//                   <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     School
//                   </th>
//                   <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredEmployees.map((emp) => (
//                   <tr key={emp.id}>
//                     <td className="px-4 py-2">
//                       <input
//                         type="checkbox"
//                         checked={selectedEmployees.includes(emp.id)}
//                         onChange={() => toggleSelectEmployee(emp.id)}
//                         className="h-4 w-4"
//                       />
//                     </td>
//                     <td className="px-4 py-2 text-sm text-gray-900">{emp.name}</td>
//                     <td className="px-4 py-2 text-sm text-gray-900">{emp.designation}</td>
//                     <td className="px-4 py-2 text-sm text-gray-900">{emp.school}</td>
//                     <td className="px-4 py-2 flex items-center text-sm">
//                       {statusIcon(emp.status)}
//                       <span className="ml-2">{emp.status}</span>
//                     </td>
//                     <td className="px-4 py-2 text-center">
//                       <select
//                         defaultValue=""
//                         onChange={(e) => {
//                           const status = e.target.value;
//                           if (status) updateAttendance(emp.id, status);
//                         }}
//                         className="border-gray-300 rounded-md py-1 px-2 text-sm"
//                       >
//                         <option value="">Select Action</option>
//                         {attendanceOptions.map((status, idx) => (
//                           <option key={idx} value={status}>
//                             {status}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                   </tr>
//                 ))}
//                 {filteredEmployees.length === 0 && (
//                   <tr>
//                     <td colSpan="6" className="px-4 py-2 text-center text-sm text-gray-500">
//                       No employees found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// }
import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page