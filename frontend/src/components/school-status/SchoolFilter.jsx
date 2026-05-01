// SchoolFilter.jsx
"use client";

import React from "react";

export default function SchoolFilter({
  zoneOptions = [],
  schemeOptions = [],
  selectedZone = "",
  selectedScheme = "",
  onZoneChange = () => {},
  onSchemeChange = () => {},
  schools = [],
  selectedSchool = "",
  onSchoolChange = () => {},
  onFilter = () => {},
}) {

  console.log("SchoolFilter props:", {
    zoneOptions,
    schemeOptions,
    selectedZone,
    selectedScheme,
    onZoneChange,
    onSchemeChange,
    schools,
    selectedSchool,
    onSchoolChange,
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-l-[3px] border-primary">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
        {zoneOptions.length > 0 && (
          <div className="flex-1 mb-4 md:mb-0">
            <label
              htmlFor="zoneSelect"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Zone
            </label>
            <select
              id="zoneSelect"
              value={selectedZone}
              onChange={onZoneChange}
              className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
            >
              <option value="">All Zones</option>
              {zoneOptions.map((zone, idx) => (
                <option key={zone.id || zone._id || idx} value={zone.name || zone}>
                  {zone.name || zone}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Render Scheme Filter only if there are scheme options */}
        {schemeOptions.length > 0 && (
          <div className="flex-1 mb-4 md:mb-0">
            <label
              htmlFor="schemeSelect"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Type
            </label>
            <select
              id="schemeSelect"
              value={selectedScheme}
              onChange={onSchemeChange}
              className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
            >
              <option value="">All Schemes</option>
              {schemeOptions.map((scheme, idx) => (
                <option key={idx} value={scheme}>
                  {scheme}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* School Selector */}
        <div className="flex-1 mb-4 md:mb-0">
          <label
            htmlFor="schoolSelect"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select School
          </label>
          <select
            id="schoolSelect"
            value={selectedSchool}
            onChange={onSchoolChange}
            className="block w-full border-gray-300 rounded-md py-2 border px-2 text-sm"
          >
            <option value="">Select a School</option>
            {schools.map((school) => (
              <option key={school.id || school._id} value={school.id || String(school._id)}>
                {school.office.officeName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
