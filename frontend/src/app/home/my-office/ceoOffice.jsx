"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import AddEmployeeModal from "@/components/school-status/AddEmployeeModal";
import EditOfficeModal from "./EditOfficeModal";
import { ToastContainer, toast } from "react-toastify";
import { Users } from "lucide-react";
import Link from "next/link"; // Added import for Link

import { MapPin, Phone, Building2, UserCheck, BadgeInfo } from "lucide-react";

export default function CeoOffice() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [employees, setEmployees] = useState([]);
  const [officeInfo, setOfficeInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [uniqueCategory, setUniqueCategory] = useState([]);
  const [uniqueDesignations, setUniqueDesignations] = useState([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (user?.officeId) {
      fetchOfficeDetails(user.officeId);
      fetchEmployees(user.officeId);
    }
  }, [user?.officeId]);

  const fetchOfficeDetails = async (officeId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/offices/${officeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch office data");
      }

      const data = await response.json();
      console.log("Office data:", data);
      setOfficeInfo(data.office);
    } catch (error) {
      console.error("Error fetching office data:", error);
    }
  };

  const fetchEmployees = async (officeId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/office/${officeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      const empList = data || [];
      setEmployees(empList);

      // Compute unique staff types (categories)
      const categories = empList.map((emp) => emp.staffType || "Unknown");
      setUniqueCategory([...new Set(categories)]);

      // Compute unique designations
      const designations = empList.map(
        (emp) => emp.presentDesignation || "Unknown"
      );
      setUniqueDesignations([...new Set(designations)]);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const addEmployeeMutation = useMutation({
    mutationFn: async (newEmployee) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/employees`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newEmployee),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add employee");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Employee added successfully");
      fetchEmployees(user.officeId);
      setIsAddModalOpen(false);
      setNewEmployeeData({});
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSaveNewEmployee = () => {
    addEmployeeMutation.mutate({
      ...newEmployeeData,
      office: user?.officeId || user?.office,
      user,
    });
  };
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (designationFilter === "" ||
        emp.presentDesignation === designationFilter) &&
      (categoryFilter === "" || emp.staffType === categoryFilter)
  );

  console.log("officeInfo:", officeInfo);

  if (!officeInfo)
    return (
      <div className="flex justify-center items-center h-full">
        <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="container capitalize">
      <ToastContainer />

      <div className="bg-white border-l-[3px] border-primary p-6 rounded-lg shadow-sm transition duration-300 mb-8 text-sm">
        <div className="flex items-center gap-3">
          <Building2 className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold text-secondary">
            {officeInfo.officeName}
          </h1>
        </div>

        <div className="mt-4 space-y-3">
          <p className="flex items-center text-gray-600">
            <BadgeInfo className="w-5 h-5 text-secondary mr-2" />
            <span className="font-semibold text-secondary mr-1">
              Office Type:
            </span>{" "}
            {officeInfo.officeType}
          </p>

          <p className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 text-secondary mr-2" />
            <span className="font-semibold text-secondary mr-1">
              Address:
            </span>{" "}
            {officeInfo.address}
          </p>

          <p className="flex items-center text-gray-600">
            <Phone className="w-5 h-5 text-secondary mr-2" />
            <span className="font-semibold text-secondary mr-1">
              Contact:
            </span>{" "}
            {officeInfo.contact}
          </p>

          <p className="flex items-center text-gray-600">
            <UserCheck className="w-5 h-5 text-secondary mr-2" />
            <span className="font-semibold text-secondary mr-1">
              Is DDO:
            </span>{" "}
            {officeInfo.isDdo ? "Yes" : "No"}
          </p>

          {officeInfo.isDdo && (
            <>
              <p className="flex items-center text-gray-600">
                <BadgeInfo className="w-5 h-5 text-secondary mr-2" />
                <span className="font-semibold text-secondary mr-1">
                  DDO ID:
                </span>{" "}
                {officeInfo.ddoOfficerId || "N/A"}
              </p>
              <p className="flex items-center text-gray-600">
                <BadgeInfo className="w-5 h-5 text-secondary mr-2" />
                <span className="font-semibold text-secondary mr-1">
                  DDO Code:
                </span>{" "}
                {officeInfo.ddoCode || "N/A"}
              </p>
            </>
          )}
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 px-4 py-2 bg-blue-500 font-medium  text-white rounded hover:bg-blue-600"
        >
          Edit Office Details
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col border-l-[3px] border-primary">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-700" />
            <h3 className="text-[15px] font-semibold">Total Employees</h3>
          </div>
          <p className="text-[13px] pt-1 text-gray-600">
            Teaching & Non-Teaching staff
          </p>
          <div className="text-2xl font-bold">{employees.length}</div>
        </div>
      </div>
      {/* Filter Employees Section */}

      <div className="bg-white shadow-sm rounded-lg p-4 mb-8 border-l-[3px] border-primary">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Filter Employees
        </h2>
        <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
          <div className="flex-1 mb-4 md:mb-0">
            <label
              htmlFor="employeeSearch"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search by Name
            </label>
            <input
              id="employeeSearch"
              type="text"
              placeholder="Employee name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full border-gray-300 rounded-md py-2 px-2 text-sm border"
            />
          </div>
          <div className="flex-1 mb-4 md:mb-0">
            <label
              htmlFor="categoryFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Staff Type
            </label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
            >
              <option value="">All Staff Types</option>
              {uniqueCategory.map((ctg, idx) => (
                <option key={idx} value={ctg}>
                  {ctg}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 mb-4 md:mb-0">
            <label
              htmlFor="designationFilter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Designation
            </label>
            <select
              id="designationFilter"
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
              className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
            >
              <option value="">All Designations</option>
              {uniqueDesignations.map((des, idx) => (
                <option key={idx} value={des}>
                  {des}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}

      {/* Employee Table */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> Employees
          </h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="font-semibold text-[13px] px-4 py-2 bg-primary transition text-white rounded hover:bg-blue-600"
          >
            Add New Employee
          </button>
        </div>
        <div className="bg-white rounded-lg overflow-x-auto border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...filteredEmployees]
                .sort((a, b) => a.fullName.localeCompare(b.fullName))
                .map((emp) => (
                  <tr key={emp._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {emp.presentDesignation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-x-2">
                      <Link
                        href={`/home/school-status/${encodeURIComponent(
                          emp._id
                        )}`}
                        className="py-1 px-3 bg-primary text-white rounded-full font-medium text-xs hover:bg-blue-600 transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <AddEmployeeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          newEmployeeData={newEmployeeData}
          setNewEmployeeData={setNewEmployeeData}
          handleSaveNewEmployee={handleSaveNewEmployee}
          showError={showError}
          setShowError={setShowError}
        />
      )}

      {isEditing && (
        <EditOfficeModal
          office={officeInfo}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onOfficeUpdate={(updatedOffice) => setOfficeInfo(updatedOffice)}
        />
      )}
    </div>
  );
}
