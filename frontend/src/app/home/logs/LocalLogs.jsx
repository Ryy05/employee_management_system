"use client";
import { useState } from "react";
import {
  FileText,
  Search,
  Eye,
  X,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Dummy Logs Data for Local Admin
const schoolAdminLogs = [
  {
    id: 1,
    admin: "Local Admin",
    role: "Admin",
    action: "Attendance Update",
    school: "Local School",
    description: "Marked attendance for 50 employees",
    timestamp: "2024-02-16 09:15 AM",
  },
  {
    id: 2,
    admin: "Local Admin",
    role: "Admin",
    action: "Incoming Transfer Approval",
    school: "Local School",
    description: "Approved incoming transfer for Teacher Alice",
    timestamp: "2024-02-16 10:30 AM",
  },
  {
    id: 3,
    admin: "Local Admin",
    role: "Admin",
    action: "Profile Modification",
    school: "Local School",
    description: "Updated profile details for Employee John",
    timestamp: "2024-02-15 02:45 PM",
  },
  {
    id: 4,
    admin: "Local Admin",
    role: "Admin",
    action: "Failed Action",
    school: "Local School",
    description: "Attempted invalid update on attendance",
    ip: "192.168.100.15",
    timestamp: "2024-02-14 05:20 PM",
  },
];

// Sample Local Admin Activity Statistics
const localStats = [
  { title: "Total Actions (24h)", value: 80 },
  { title: "Attendance Updates", value: 35 },
  { title: "Transfers Processed", value: 15 },
  { title: "Profile Modifications", value: 10 },
];

export default function LocalLogsPage() {
  const [logs] = useState(schoolAdminLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);

  // Filter logs based on admin, action, or school
  const filteredLogs = logs.filter(
    (log) =>
      log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <div className="max-w-7xl mx-auto p-4">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Activity Logs
          </h1>
          <p className="mt-2 font-medium text-gray-600">
            Overview of local admin actions and school-specific activities
          </p>
        </header>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {localStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded-lg shadow border-l-[3px] border-primary"
            >
              <h3 className="text-sm font-semibold text-gray-700">
                {stat.title}
              </h3>
              <p className="text-xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex items-center mb-6">
          <div className="relative w-full text-sm">
            <Search className="w-5 h-5 text-gray-500 absolute top-1/2 left-3 transform -translate-y-1/2" />
            <input
              type="text"
              className="border border-gray-300 pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg overflow-x-auto shadow border font-medium">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Date & Time
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Admin
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Action
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Description
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="p-3 text-xs text-gray-700">{log.timestamp}</td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {log.admin} <span className="text-xs text-gray-500">({log.role})</span>
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">{log.action}</td>
                  <td className="p-3 text-[13px] text-gray-700 line-clamp-1">{log.description}</td>
                  <td className="p-3">
                    <button
                      className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full font-medium text-xs hover:bg-blue-600 transition"
                      onClick={() => setModalData(log)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-sm text-gray-500">
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Log Details Modal */}
        {modalData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                onClick={() => setModalData(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                Log Details
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Admin:</strong> {modalData.admin}{" "}
                  <span className="text-sm text-gray-500">({modalData.role})</span>
                </p>
                <p>
                  <strong>Action:</strong> {modalData.action}
                </p>
                
                <p>
                  <strong>Description:</strong> {modalData.description}
                </p>
                <p>
                  <strong>Timestamp:</strong> {modalData.timestamp}
                </p>
                {modalData.ip && (
                  <p>
                    <strong>IP Address:</strong> {modalData.ip}
                  </p>
                )}
              </div>
              <button
                className="mt-6 w-full py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                onClick={() => setModalData(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
