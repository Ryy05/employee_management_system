"use client";

import { useState } from "react";
import { FileText, Search, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";


const fetchLogs = async ({ queryKey }) => {
  const [_key, role, officeId, zoneId] = queryKey;
  const token = localStorage.getItem("token");

  let endpoint = "/logs"; // default for CEO

  if (role === "ZEO" && zoneId) {
    endpoint = `/logs/zone/${zoneId}`;
  } else if (role === "schoolAdmin" && officeId) {
    endpoint = `/logs/office/${officeId}`;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch logs");
  }

  return res.json();
};



const fetchStats = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logs/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch statistics");
  }
  return res.json(); 
};

export default function AdminLogs() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;
  const {user} = useUser();

  const {
    data: logsData,
    error: logsError,
    isLoading: logsLoading,
  } = useQuery({
    queryKey: ["logs", user?.role, user?.officeId, user?.zoneId],
    queryFn: fetchLogs,
    enabled: !!user?.role,
    refetchOnWindowFocus: false,
  });
  


  const {
    data: statsData,
    error: statsError,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["logs", "stats"],
    queryFn: fetchStats,
    refetchOnWindowFocus: false,
  });


  const logs = logsData?.logs || [];
  const systemStats = statsData?.stats || [];


  const filteredLogs = logs.filter(
    (log) =>
      log.admin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.school?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (logsLoading || statsLoading) {
    return <div className="flex justify-center items-center h-full">
    <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
  </div>;
  }

  if (logsError || statsError) {
    return (
      <p className="text-center mt-8 text-red-500">
        Error: {logsError?.message || statsError?.message}
      </p>
    );
  }

  return (
    <div className="min-h-screen capitalize">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            System Logs & Activity Tracking
          </h1>
          <p className="mt-2 font-medium text-gray-600">
            Overview of system actions and activity
          </p>
        </header>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {systemStats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded-lg shadow border-l-[3px] border-primary"
            >
              <h3 className="text-sm font-semibold text-gray-700">
                {stat.title}
              </h3>
              <p className="text-lg font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
          ))}
        </div>


        <div className="flex items-center mb-6">
          <div className="relative w-full text-sm">
            <Search className="w-5 h-5 text-gray-500 absolute top-1/2 left-3 transform -translate-y-1/2" />
            <input
              type="text"
              className="border border-gray-300 pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={handleSearchChange}
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
              {currentLogs.map((log, index) => (
                <tr key={log.id || index}>
                  <td className="p-3 text-xs text-gray-700">{log.time}</td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {log.admin}{" "}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700">
                    {log.action}
                  </td>
                  <td className="p-3 text-[13px] text-gray-700 line-clamp-2">
                    {log.description}
                  </td>
                  <td className="p-3">
                    <button
                      className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full font-medium text-xs hover:bg-blue-600 transition"
                      onClick={() => setModalData(log)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {currentLogs.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-3 text-center text-sm text-gray-500"
                    style={{ zIndex: 9999 }}
                  >
                    No logs found.
                  </td>

                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredLogs.length > logsPerPage && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="p-1 border-gray-500 cursor-pointer bg-white hover:bg-gray-100 transition border rounded-full disabled:opacity-50"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5"/>
            </button>
            <span className="px-3 text-sm font-semibold text-gray-800 py-1">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              className="p-1 border-gray-500 cursor-pointer bg-white hover:bg-gray-100 transition border rounded-full disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-5 h-5"/>
            </button>
          </div>
        )}

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
                  <span className="text-sm text-gray-500">
                    ({modalData.role})
                  </span>
                </p>
                <p>
                  <strong>Action:</strong> {modalData.action}
                </p>
                <p>
                  <strong>Affected School:</strong> {modalData.school}
                </p>
                <p>
                  <strong>Description:</strong> {modalData.description}
                </p>
                <p>
                  <strong>Timestamp:</strong> {modalData.time}
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


