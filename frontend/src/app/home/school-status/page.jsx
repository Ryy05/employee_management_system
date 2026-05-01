"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import axiosClient from "@/api/axiosClient";
import SchoolFilter from "@/components/school-status/SchoolFilter";
import SchoolDetailsCard from "@/components/school-status/SchoolDetailsCard";
import { toast } from "react-toastify";

function SchoolStatusPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userRole, user } = useUser();


  const userDistrictId = user?.districtId;
  const userZoneId = user?.zoneId;
  const userOfficeId = user?.officeId;

  const userRoleIsCEO = userRole === "CEO";
  const userRoleIsZEO = userRole === "ZEO";
  const userRoleIsSchoolAdmin = userRole === "schoolAdmin";

  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [userSelectedSchool, setUserSelectedSchool] = useState(false); 
  const [selectedZone, setSelectedZone] = useState(""); 
  const [selectedScheme, setSelectedScheme] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [schemeOptions, setSchemeOptions] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
    
        if (userRoleIsSchoolAdmin && userOfficeId) {
          try {
          const response = await axiosClient.get(`/schools/office/${userOfficeId}`);
          if (response?.data?.length > 0) {
            const school = response.data[0];
            setSelectedSchool(school);
            setSelectedSchoolId(school._id || "");
            setFilteredSchools([school]);
            setUserSelectedSchool(true); 
            setSchools([school]);
          } else {
            setStatusMessage("No schools associated with your account.");
          }
        } catch (err) {
          if (!err.isHandled) {
            console.error("Error fetching schools for school admin:", err);
          }
          setStatusMessage("Unable to load school information.");
        }
          setIsLoading(false);
          return; 
        }
    
        if (userRoleIsCEO && userDistrictId) {
          const response = await axiosClient.get(`/schools/district/${userDistrictId}`);
          const zonesResponse = await axiosClient.get(`/zones?district=${userDistrictId}`);
          if (zonesResponse.data?.zones) {
            setZoneOptions(zonesResponse.data.zones);
          }
          if (response?.data?.length > 0) {
            setSchools(response.data);
            setFilteredSchools(response.data);
            const schemes = response.data.map(s => s.scheme).filter(Boolean);
            setSchemeOptions([...new Set(schemes)]);
            setError(null);
          } else {
            setError("No schools found in this district.");
          }
          setIsLoading(false);
          return;
        }
    
        if (userRoleIsCEO && userDistrictId) {
          try {
            const response = await axiosClient.get(`/schools/district/${userDistrictId}`);
            const zonesResponse = await axiosClient.get(`/zones?district=${userDistrictId}`);
            if (zonesResponse.data?.zones) {
              setZoneOptions(zonesResponse.data.zones);
            }
            
            if (response?.data?.length > 0) {
              setSchools(response.data);
              setFilteredSchools(response.data);
              const schemes = response.data.map(s => s.scheme).filter(Boolean);
              setSchemeOptions([...new Set(schemes)]);
            } else {
              setStatusMessage("No schools found in this district.");
            }
          } catch (err) {
            if (!err.isHandled) {
              console.error("Error fetching district schools:", err);
            }
            
            if (err.response && err.response.data && err.response.data.message === "No zones found for the given district.") {
              setStatusMessage("No zones have been created in this district yet. Please create zones first.");
            } else {
              setStatusMessage("Unable to load schools for this district.");
            }
          }
          setIsLoading(false);
          return;
        }
    
        if (userRoleIsZEO && userZoneId) {
          try {
            const response = await axiosClient.get(`/schools/zone/${userZoneId}`);
            if (response?.data?.length > 0) {
              setSchools(response.data);
              setFilteredSchools(response.data);
              const schemes = response.data.map(s => s.scheme).filter(Boolean);
              setSchemeOptions([...new Set(schemes)]);
            } else {
              setStatusMessage("No schools found in this zone.");
            }
          } catch (err) {
            if (!err.isHandled) {
              console.error("Error fetching zone schools:", err);
            }
            setStatusMessage("Unable to load schools for this zone.");
          }
          setIsLoading(false);
          return;
        }
      } catch (err) {
        if (!err.isHandled) {
          console.error("Unexpected error in fetchSchools:", err);
        }
        setStatusMessage("Unable to load school data.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchools();
  }, [userRole, userDistrictId, userZoneId, userOfficeId]);

  useEffect(() => {
  const schoolIdFromUrl = searchParams.get("school");

  if (
    schoolIdFromUrl &&
    filteredSchools.length > 0 &&
    !selectedSchoolId 
  ) {
    const matchedSchool = filteredSchools.find(s => s._id === schoolIdFromUrl);
    if (matchedSchool) {
      setSelectedSchoolId(schoolIdFromUrl);
      setSelectedSchool(matchedSchool);
      setUserSelectedSchool(true);
    }
  }
}, [searchParams, filteredSchools]);

  const handleFilter = (filteredList) => {
    setFilteredSchools(filteredList);
  };

  const handleZoneChange = (event) => {
    const zone = event.target.value;
    setSelectedZone(zone);

    const filtered = schools.filter(school => 
      !zone || (school.zone?.name === zone)
    );
    setFilteredSchools(filtered);
    
    setSelectedSchool("");
    setSelectedSchoolId("");
    setUserSelectedSchool(false);
  };

  const handleSchemeChange = (event) => {
    const scheme = event.target.value;
    setSelectedScheme(scheme);

    const filtered = schools.filter(school => 
      !scheme || school.scheme === scheme
    );
    setFilteredSchools(filtered);
    setSelectedSchool("");
    setSelectedSchoolId("");
    setUserSelectedSchool(false);
  };

  const handleSchoolSelect = async (event) => {
    const schoolId = event.target.value;
    setSelectedSchoolId(schoolId);
    
    if (!schoolId) {
      setSelectedSchool("");
      setUserSelectedSchool(false);
      return;
    }
    
    const selectedSchoolObject = filteredSchools.find(school => school._id === schoolId);
    if (selectedSchoolObject) {
      setSelectedSchool(selectedSchoolObject);
      setUserSelectedSchool(true);
      router.push(`/home/school-status?school=${schoolId}`);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-secondary">School Status Dashboard</h1>
        <p className="mt-2 font-medium text-gray-600">Manage and view school details</p>
      </header>

      {statusMessage && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border-l-4 border-yellow-400">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-yellow-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-700 font-medium">{statusMessage}</p>
          </div>
        </div>
      )}

      {user?.role !== "schoolAdmin" && filteredSchools.length > 0 && (
        <SchoolFilter
          schools={filteredSchools}
          onFilter={handleFilter}
          onSchoolSelect={handleSchoolSelect}
          zoneOptions={zoneOptions}
          schemeOptions={schemeOptions}
          selectedZone={selectedZone} 
          selectedScheme={selectedScheme}
          selectedSchool={selectedSchoolId}
          onZoneChange={handleZoneChange}
          onSchemeChange={handleSchemeChange}
          onSchoolChange={handleSchoolSelect}
        />
      )}

     
      {(userRoleIsSchoolAdmin || userSelectedSchool) && selectedSchool && (
        <SchoolDetailsCard schoolInfo={selectedSchool} />
      )}
    </div>
  );
}

export default function SchoolStatusPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full">
      <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
    </div>}>
      <SchoolStatusPageContent />
    </Suspense>
  );
}