"use client";

import React, { useState, useEffect } from "react";
import { staffTypes,highestQualificationOptions,teachingPosts,nonTeachingPosts,pgSpecializationOptions,currentPayscaleOptions,pensionSchemeOptions,basicPayByPayscale } from "@/data/options";
import Select from "react-select";
import axiosClient from "@/api/axiosClient";
import { ToastContainer, toast } from "react-toastify";





export default function AddEmployeeModal({
  newEmployeeData,
  setNewEmployeeData,
  isOpen,
  onClose,
  showError,
  setShowError,
  schoolInfo,
  setEmployees, 
  setIsAddModalOpen, 
  queryClient,
  handleSaveNewEmployee 
}) {
  if (!isOpen) return null;

  const [posts, setPosts] = useState([]);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [offices, setOffices] = useState([]);
  const [officeOptions, setOfficeOptions] = useState([]);
  const [officeOptions2, setOfficeOptions2] = useState([]);
  const [requiredErrors, setRequiredErrors] = useState({});



  const validateFields = () => {
    const errors = {};
    if (!newEmployeeData.employeeId) errors.employeeId = "This field is required";
    if (!newEmployeeData.fullName) errors.fullName = "This field is required";
    if (!newEmployeeData.gender) errors.gender = "This field is required";
    if (!newEmployeeData.maritalStatus) errors.maritalStatus = "This field is required";
    if (!newEmployeeData.parentageOrSpouse) errors.parentageOrSpouse = "This field is required";
    if (!newEmployeeData.dateOfBirth) errors.dateOfBirth = "This field is required";
    if (!newEmployeeData.staffType) errors.staffType = "This field is required";
    if (!newEmployeeData.postCategory) errors.postCategory = "This field is required";
    if (!newEmployeeData.presentDesignation) errors.presentDesignation = "This field is required";
    if (!newEmployeeData.designationAtFirstAppointment) errors.designationAtFirstAppointment = "This field is required";
    if (!newEmployeeData.dateOfFirstAppointment) errors.dateOfFirstAppointment = "This field is required";
    if (!newEmployeeData.dateOfRetirement) errors.dateOfRetirement = "This field is required";
    if (!newEmployeeData.dateOfRecentPromotion) errors.dateOfRecentPromotion = "This field is required";
    if (!newEmployeeData.postedOffice) errors.postedOffice = "This field is required";
    if (!newEmployeeData.basisOfWork) errors.basisOfWork = "This field is required";
    if (!newEmployeeData.highestQualification) errors.highestQualification = "This field is required";
    if (
      newEmployeeData.highestQualification !== "10TH" &&
      newEmployeeData.highestQualification !== "12TH"
    ) {
      if (!newEmployeeData.specializationSubject) errors.specializationSubject = "This field is required";
      if (!newEmployeeData.pgUniversity) errors.pgUniversity = "This field is required";
    }
    if (!newEmployeeData.bed) errors.bed = "This field is required";
    if (newEmployeeData.bed === "Yes" && !newEmployeeData.bedUniversity) {
      errors.bedUniversity = "This field is required";
    }
    if (!newEmployeeData.dateOfCurrentPosting) errors.dateOfCurrentPosting = "This field is required";
    if (!newEmployeeData.payScaleAndLevel) errors.payScaleAndLevel = "This field is required";
    if (!newEmployeeData.basicPay) errors.basicPay = "This field is required";
    if (!newEmployeeData.grossSalary) errors.grossSalary = "This field is required";
    if (!newEmployeeData.pensionScheme) errors.pensionScheme = "This field is required";
    if (!newEmployeeData.phoneNo) errors.phoneNo = "This field is required";
    if (!newEmployeeData.email) errors.email = "This field is required";
    if (!newEmployeeData.credentials?.passwordHash) errors.password = "This field is required";
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill all required fields");
      setRequiredErrors(errors);
      return false;
    }
    setRequiredErrors({});
    return true;
  };
  

  const handleSave = () => {
    if (!validateFields()) return;
    console.log("Submitted postedOffice:", newEmployeeData.postedOffice);
    handleSaveNewEmployee();
  };
  
  
  const getSanctionedPosts = () => {
    if (newEmployeeData.staffType === "Teaching") return teachingPosts;
    if (newEmployeeData.staffType === "Non-Teaching") return nonTeachingPosts;
    return [];
  };

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await axiosClient.get("/offices");
        console.log("Fetched Offices:", response.data.offices);
        const options = response.data.offices.map((office) => ({
          value: office.officeName,
          label: `${office.officeName}`
        }));
        const options2 = response.data.offices.map((office) => ({
          value: office._id,        
          label: office.officeName  
        }));
        
        setOffices(response.data.offices);
        setOfficeOptions(options);
        setOfficeOptions2(options2);
      } catch (err) {
        console.error("Error fetching offices:", err);
      }
    };
    fetchOffices();
  }, []);

  console.log("options", officeOptions);



  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 text-[13px] font-normal backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8  shadow-2xl max-w-2xl max-h-[90vh] w-full overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Employee</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-6 text-sm">
          <div>
    <label className="font-semibold text-gray-600 block mb-1">Employee ID</label>
    <input
      type="text"
      name="employeeId"
      value={newEmployeeData.employeeId || ""}
      onChange={(e) => {
      setNewEmployeeData({ ...newEmployeeData, employeeId: e.target.value });
      setRequiredErrors({ ...requiredErrors, employeeId: "" });
    }}
    className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
    />
    {requiredErrors.employeeId && <p className="text-red-500 text-xs mt-1">{requiredErrors.employeeId}</p>}
  </div>
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Full Name</label>
    <input
      type="text"
      name="fullName"
      value={newEmployeeData.fullName || ""}
      onChange={(e) => {
        setNewEmployeeData({ ...newEmployeeData, fullName: e.target.value });
        setRequiredErrors({ ...requiredErrors, fullName: "" });
      }}
       className={`border rounded w-full p-2 ${requiredErrors.fullName ? "border-red-500" : "border-gray-300"}`}
    />
    {requiredErrors.fullName && <p className="text-red-500 text-xs mt-1">{requiredErrors.fullName}</p>}
  </div>
  <div>
  <label className="font-semibold text-gray-600 block mb-1">Gender</label>
  <select
    name="gender"
    value={newEmployeeData.gender || ""}
    onChange={(e) => {
      setNewEmployeeData({ ...newEmployeeData, gender: e.target.value });
      setRequiredErrors((prev) => ({ ...prev, gender: "" })); 
    }}
    className={`border rounded w-full p-2 ${requiredErrors.gender ? "border-red-500" : "border-gray-300"}`}
  >
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
  {requiredErrors.gender && <p className="text-red-500 text-xs mt-1">{requiredErrors.gender}</p>}
</div>
  <div>
  <label className="font-semibold text-gray-600 block mb-1">Marital Status</label>
  <select
    name="maritalStatus"
    value={newEmployeeData.maritalStatus || ""}
    onChange={(e) => {
      setNewEmployeeData({ ...newEmployeeData, maritalStatus: e.target.value });
      setRequiredErrors((prev) => ({ ...prev, maritalStatus: "" }));
    }}
    className={`border rounded w-full p-2 ${requiredErrors.maritalStatus ? "border-red-500" : "border-gray-300"}`}
  >
    <option value="">Select Marital Status</option>
    <option value="Single">Single</option>
    <option value="Married">Married</option>
    <option value="Other">Other</option>
  </select>
  {requiredErrors.maritalStatus && <p className="text-red-500 text-xs mt-1">{requiredErrors.maritalStatus}</p>}
</div>
  <div>
  <label className="font-semibold text-gray-600 block mb-1">Parentage/Spouse</label>
  <input
    type="text"
    name="parentageOrSpouse"
    value={newEmployeeData.parentageOrSpouse || ""}
    onChange={(e) => {
      setNewEmployeeData({ ...newEmployeeData, parentageOrSpouse: e.target.value });
      setRequiredErrors((prev) => ({ ...prev, parentageOrSpouse: "" }));
    }}
    className={`border rounded w-full p-2 ${requiredErrors.parentageOrSpouse ? "border-red-500" : "border-gray-300"}`}
  />
  {requiredErrors.parentageOrSpouse && <p className="text-red-500 text-xs mt-1">{requiredErrors.parentageOrSpouse}</p>}
</div>


  
<div>
  <label className="font-semibold text-gray-600 block mb-1">Date of Birth</label>
  <input
    type="date"
    name="dateOfBirth"
    value={newEmployeeData.dateOfBirth || ""}
    onChange={(e) => {
      setNewEmployeeData({ ...newEmployeeData, dateOfBirth: e.target.value });
      setRequiredErrors((prev) => ({ ...prev, dateOfBirth: "" }));
    }}
    className={`border rounded w-full p-2 ${requiredErrors.dateOfBirth ? "border-red-500" : "border-gray-300"}`}
  />
  {requiredErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{requiredErrors.dateOfBirth}</p>}
</div>


<div>
  <label htmlFor="staffType" className="block text-sm font-medium text-gray-700 mb-1">Select Staff Type</label>
  <select
    id="staffType"
    value={newEmployeeData.staffType || ""}
    onChange={(e) => {
      setNewEmployeeData({
        ...newEmployeeData,
        staffType: e.target.value,
        presentDesignation: "",
        designationAtFirstAppointment: ""
      });
      setShowError(false);
      setRequiredErrors((prev) => ({ ...prev, staffType: "" }));
    }}
    className={`block w-full border rounded-md py-2 px-2 text-sm ${requiredErrors.staffType ? "border-red-500" : "border-gray-300"}`}
  >
    <option value="">Select Staff Type</option>
    {staffTypes.map((type, index) => (
      <option key={index} value={type}>{type}</option>
    ))}
  </select>
  {requiredErrors.staffType && <p className="text-red-500 text-xs mt-1">{requiredErrors.staffType}</p>}
</div>


<div>
  <label htmlFor="postCategory" className="block text-sm font-medium text-gray-700 mb-1">Select Post Category</label>
  <select
    id="postCategory"
    value={newEmployeeData.postCategory || ""}
    onChange={(e) => {
      setNewEmployeeData({ ...newEmployeeData, postCategory: e.target.value });
      setRequiredErrors((prev) => ({ ...prev, postCategory: "" }));
    }}
    className={`block w-full border rounded-md py-2 px-2 text-sm ${requiredErrors.postCategory ? "border-red-500" : "border-gray-300"}`}
  >
    <option value="">Select Post Category</option>
    <option value="Gazetted">Gazetted</option>
    <option value="Non-Gazetted">Non-Gazetted</option>
  </select>
  {requiredErrors.postCategory && <p className="text-red-500 text-xs mt-1">{requiredErrors.postCategory}</p>}
</div>
  <div>
  <label className="font-semibold text-gray-600 block mb-1">Present Designation</label>
  <select
    value={newEmployeeData.presentDesignation || ""}
    onChange={(e) => {
      if (!newEmployeeData.staffType) {
        setShowError(true);
        return;
      }
      setNewEmployeeData((prev) => ({ ...prev, presentDesignation: e.target.value }));
      setRequiredErrors((prev) => ({ ...prev, presentDesignation: "" }));
    }}
    className={`border rounded w-full p-2 ${requiredErrors.presentDesignation ? "border-red-500" : "border-gray-300"}`}
  >
    <option value="">
      {newEmployeeData.staffType ? "Select Post" : "Please select a staff type first"}
    </option>
    {newEmployeeData.staffType &&
      getSanctionedPosts().map((post, index) => (
        <option key={index} value={post}>
          {post}
        </option>
      ))}
  </select>
  {requiredErrors.presentDesignation && <p className="text-red-500 text-xs mt-1">{requiredErrors.presentDesignation}</p>}
</div>


  <div>
  <label className="font-semibold text-gray-600 block mb-1">Designation at Appointment</label>
  <select
    name="designationAtFirstAppointment"
    value={newEmployeeData.designationAtFirstAppointment || ""}
    onChange={(e) => {
      setNewEmployeeData({ ...newEmployeeData, designationAtFirstAppointment: e.target.value });
      setRequiredErrors(prev => ({ ...prev, designationAtFirstAppointment: "" }));
    }}
    className={`border rounded w-full p-2 ${requiredErrors.designationAtFirstAppointment ? "border-red-500" : "border-gray-300"}`}
  >
    <option value="">Select Designation</option>
    {(newEmployeeData.staffType === "Teaching" ? teachingPosts : nonTeachingPosts).map((opt, idx) => (
      <option key={idx} value={opt}>{opt}</option>
    ))}
  </select>
  {requiredErrors.designationAtFirstAppointment && (
    <p className="text-red-500 text-xs mt-1">{requiredErrors.designationAtFirstAppointment}</p>
  )}
</div>

          <div>
  <label className="font-semibold text-gray-600 block mb-1">Date of First Appointment</label>
  <input
    type="date"
    name="dateOfFirstAppointment"
    value={newEmployeeData.dateOfFirstAppointment || ""}
    onChange={(e) => {
      setNewEmployeeData({ ...newEmployeeData, dateOfFirstAppointment: e.target.value });
      setRequiredErrors(prev => ({ ...prev, dateOfFirstAppointment: "" }));
    }}
    className={`border rounded w-full p-2 ${requiredErrors.dateOfFirstAppointment ? "border-red-500" : "border-gray-300"}`}
  />
  {requiredErrors.dateOfFirstAppointment && (
    <p className="text-red-500 text-xs mt-1">{requiredErrors.dateOfFirstAppointment}</p>
  )}
</div>

          <div>
  <label className="font-semibold text-gray-600 block mb-1">Date of Retirement</label>
  <input
    type="date"
    name="dateOfRetirement"
    value={newEmployeeData.dateOfRetirement || ""}
    onChange={(e) => {
      setNewEmployeeData({ ...newEmployeeData, dateOfRetirement: e.target.value });
      setRequiredErrors(prev => ({ ...prev, dateOfRetirement: "" }));
    }}
    className={`border rounded w-full p-2 ${requiredErrors.dateOfRetirement ? "border-red-500" : "border-gray-300"}`}
  />
  {requiredErrors.dateOfRetirement && (
    <p className="text-red-500 text-xs mt-1">{requiredErrors.dateOfRetirement}</p>
  )}
</div>

          <div>
  <label className="font-semibold text-gray-600 block mb-1">Date of Recent Promotion</label>
  <input
    type="date"
    name="dateOfRecentPromotion"
    value={newEmployeeData.dateOfRecentPromotion || ""}
    onChange={(e) => {
      setNewEmployeeData({ ...newEmployeeData, dateOfRecentPromotion: e.target.value });
      setRequiredErrors(prev => ({ ...prev, dateOfRecentPromotion: "" }));
    }}
    className={`border rounded w-full p-2 ${requiredErrors.dateOfRecentPromotion ? "border-red-500" : "border-gray-300"}`}
  />
  {requiredErrors.dateOfRecentPromotion && (
    <p className="text-red-500 text-xs mt-1">{requiredErrors.dateOfRecentPromotion}</p>
  )}
</div>


<div>
  <label className="font-semibold text-gray-600 block mb-1">Posted Office</label>
  <Select
    options={officeOptions}
    value={officeOptions.find(opt => opt.value === newEmployeeData.postedOffice) || null}
    onChange={(selected) => {
      const value = selected?.value || "";
      setNewEmployeeData({ ...newEmployeeData, postedOffice: value });
      setRequiredErrors(prev => ({ ...prev, postedOffice: "" }));
    }}
    placeholder="Search and select office"
    classNamePrefix="react-select"
    className={`text-sm ${requiredErrors.postedOffice ? "border border-red-500 rounded" : ""}`}
  />
  {requiredErrors.postedOffice && (
    <p className="text-red-500 text-xs mt-1">{requiredErrors.postedOffice}</p>
  )}
</div>


          <div>
  <label className="font-semibold text-gray-600 block mb-1">Basis of Work</label>
  <select
    name="basisOfWork"
    value={newEmployeeData.basisOfWork || ""}
    onChange={(e) => {
      setNewEmployeeData({ ...newEmployeeData, basisOfWork: e.target.value });
      setRequiredErrors(prev => ({ ...prev, basisOfWork: "" }));
    }}
    className={`border rounded w-full p-2 ${requiredErrors.basisOfWork ? "border-red-500" : "border-gray-300"}`}
  >
    <option value="">Select Basis of Work</option>
    <option value="DEPUTED">DEPUTED</option>
    <option value="FILLED">FILLED</option>
    <option value="SUPERNUMERARY">SUPERNUMERARY</option>
    <option value="PAYORDER">PAYORDER</option>
    <option value="OTHER">OTHER</option>
  </select>
  {requiredErrors.basisOfWork && (
    <p className="text-red-500 text-xs mt-1">{requiredErrors.basisOfWork}</p>
  )}
</div>


          <div>
  <label className="font-semibold text-gray-600 block mb-1">Highest Qualification</label>
  <select
    name="highestQualification"
    value={newEmployeeData.highestQualification || ""}
    onChange={(e) => {
      setNewEmployeeData({
        ...newEmployeeData,
        highestQualification: e.target.value,
        specializationSubject: (["10TH", "12TH"].includes(e.target.value) ? "" : newEmployeeData.specializationSubject),
      });
      setRequiredErrors(prev => ({ ...prev, highestQualification: "" }));
    }}
    className={`border rounded w-full p-2 ${requiredErrors.highestQualification ? "border-red-500" : "border-gray-300"}`}
  >
    <option value="">Select Qualification</option>
    {highestQualificationOptions.map((qual, idx) => (
      <option key={idx} value={qual}>{qual}</option>
    ))}
  </select>
  {requiredErrors.highestQualification && (
    <p className="text-red-500 text-xs mt-1">{requiredErrors.highestQualification}</p>
  )}
</div>



  {newEmployeeData.highestQualification && newEmployeeData.highestQualification !== "10TH" && newEmployeeData.highestQualification !== "12TH" && (
  <div>
    <label className="font-semibold text-gray-600 block mb-1">
      {newEmployeeData.highestQualification === "PHD" ? "Specialization (Enter Text)" : "Specialization Subject"}
    </label>
    {newEmployeeData.highestQualification === "PHD" ? (
      <>
        <input
          type="text"
          name="specializationSubject"
          value={newEmployeeData.specializationSubject || ""}
          onChange={(e) => setNewEmployeeData({ ...newEmployeeData, specializationSubject: e.target.value })}
          className={`border rounded w-full p-2 ${requiredErrors.specializationSubject ? "border-red-500" : "border-gray-300"}`}
        />
        {requiredErrors.specializationSubject && <p className="text-red-500 text-xs mt-1">{requiredErrors.specializationSubject}</p>}
      </>
    ) : (
      <>
        <select
          name="specializationSubject"
          value={newEmployeeData.specializationSubject || ""}
          onChange={(e) => setNewEmployeeData({ ...newEmployeeData, specializationSubject: e.target.value })}
          className={`border rounded w-full p-2 ${requiredErrors.specializationSubject ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Select Specialization Subject</option>
          {pgSpecializationOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
          <option value="Other">Other</option>
        </select>
        {requiredErrors.specializationSubject && <p className="text-red-500 text-xs mt-1">{requiredErrors.specializationSubject}</p>}
      </>
    )}
  </div>
)}


  {/* PG UNIVERSITY - Label dynamically based on highestQualification */}
  {newEmployeeData.highestQualification && newEmployeeData.highestQualification !== "10TH" && newEmployeeData.highestQualification !== "12TH" && (
  <div>
    <label className="font-semibold text-gray-600 block mb-1">
      {newEmployeeData.highestQualification} University
    </label>
    <input
      type="text"
      name="pgUniversity"
      value={newEmployeeData.pgUniversity || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, pgUniversity: e.target.value })}
      className={`border rounded w-full p-2 ${requiredErrors.pgUniversity ? "border-red-500" : "border-gray-300"}`}
    />
    {requiredErrors.pgUniversity && <p className="text-red-500 text-xs mt-1">{requiredErrors.pgUniversity}</p>}
  </div>
)}


  {/* B.ED and B.ED UNIVERSITY */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">B.Ed</label>
    <select
      name="bed"
      value={newEmployeeData.bed || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, bed: e.target.value })}
       className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
    >
      <option value="">Select</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>
  {newEmployeeData.bed === "Yes" && (
  <div>
    <label className="font-semibold text-gray-600 block mb-1">B.Ed University</label>
    <input
      type="text"
      name="bedUniversity"
      value={newEmployeeData.bedUniversity || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, bedUniversity: e.target.value })}
      className={`border rounded w-full p-2 ${requiredErrors.bedUniversity ? "border-red-500" : "border-gray-300"}`}
    />
    {requiredErrors.bedUniversity && <p className="text-red-500 text-xs mt-1">{requiredErrors.bedUniversity}</p>}
  </div>
)}


  {/* ANY OTHER CERTIFICATION */}
  <div>
    <label className="font-semibold text-gray-600 block mb-1">Any Other Certification</label>
    <input
      type="text"
      name="anyOtherCertification"
      value={newEmployeeData.anyOtherCertification || ""}
      onChange={(e) => setNewEmployeeData({ ...newEmployeeData, anyOtherCertification: e.target.value })}
       className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
    />
    {requiredErrors.employeeId && <p className="text-red-500 text-xs mt-1">{requiredErrors.employeeId}</p>}
  </div>

  {/* DATE FROM WHICH WORKING IN CURRENT OFFICE */} 
  <div>
  <label className="font-semibold text-gray-600 block mb-1">Working Since (Current Office)</label>
  <input
    type="date"
    name="dateOfCurrentPosting"
    value={newEmployeeData.dateOfCurrentPosting || ""}
    onChange={(e) =>
      setNewEmployeeData({ ...newEmployeeData, dateOfCurrentPosting: e.target.value })
    }
    className={`border rounded w-full p-2 ${requiredErrors.dateOfCurrentPosting ? "border-red-500" : "border-gray-300"}`}
  />
  {requiredErrors.dateOfCurrentPosting && (
    <p className="text-red-500 text-xs mt-1">{requiredErrors.dateOfCurrentPosting}</p>
  )}
</div>


  {/* CURRENT PAY SCALE AND LEVEL */}
  <div>
  <label className="font-semibold text-gray-600 block mb-1">Current Payscale and Level</label>
  <select
    name="payScaleAndLevel"
    value={newEmployeeData.payScaleAndLevel || ""}
    onChange={(e) =>
      setNewEmployeeData({ ...newEmployeeData, payScaleAndLevel: e.target.value })
    }
    className={`border rounded w-full p-2 ${requiredErrors.payScaleAndLevel ? "border-red-500" : "border-gray-300"}`}
  >
    <option value="">Select Payscale and Level</option>
    {currentPayscaleOptions.map((opt, idx) => (
      <option key={idx} value={opt}>
        {opt}
      </option>
    ))}
  </select>
  {requiredErrors.payScaleAndLevel && (
    <p className="text-red-500 text-xs mt-1">{requiredErrors.payScaleAndLevel}</p>
  )}
</div>


  {/* CURRENT BASIC PAY */}
  <div>
  <label className="font-semibold text-gray-600 block mb-1">Current Basic Pay</label>
  <select
    name="basicPay"
    value={newEmployeeData.basicPay || ""}
    onChange={(e) =>
      setNewEmployeeData({ ...newEmployeeData, basicPay: e.target.value })
    }
    className={`border rounded w-full p-2 ${requiredErrors.basicPay ? "border-red-500" : "border-gray-300"}`}
    disabled={!newEmployeeData.payScaleAndLevel}
  >
    <option value="">Select Basic Pay</option>
    {(basicPayByPayscale[newEmployeeData.payScaleAndLevel] || []).map((pay, idx) => (
      <option key={idx} value={pay}>
        {pay}
      </option>
    ))}
  </select>
  {requiredErrors.basicPay && (
    <p className="text-red-500 text-xs mt-1">{requiredErrors.basicPay}</p>
  )}
</div>



  {/* GROSS SALARY */}
  <div>
  <label className="font-semibold text-gray-600 block mb-1">Gross Salary</label>
  <input
    type="text"
    name="grossSalary"
    value={newEmployeeData.grossSalary || ""}
    onChange={(e) =>
      setNewEmployeeData({ ...newEmployeeData, grossSalary: e.target.value })
    }
    className={`border rounded w-full p-2 ${requiredErrors.grossSalary ? "border-red-500" : "border-gray-300"}`}
  />
  {requiredErrors.grossSalary && (
    <p className="text-red-500 text-xs mt-1">{requiredErrors.grossSalary}</p>
  )}
</div>


  {/* PENSION SCHEME */}
  <div>
  <label className="font-semibold text-gray-600 block mb-1">Pension Scheme</label>
  <select
    name="pensionScheme"
    value={newEmployeeData.pensionScheme || ""}
    onChange={(e) =>
      setNewEmployeeData({ ...newEmployeeData, pensionScheme: e.target.value })
    }
    className={`border rounded w-full p-2 ${requiredErrors.pensionScheme ? "border-red-500" : "border-gray-300"}`}
  >
    <option value="">Select Pension Scheme</option>
    {pensionSchemeOptions.map((scheme, idx) => (
      <option key={idx} value={scheme}>
        {scheme}
      </option>
    ))}
  </select>
  {requiredErrors.pensionScheme && (
    <p className="text-red-500 text-xs mt-1">{requiredErrors.pensionScheme}</p>
  )}
</div>


  {/* Salary Details Section */}
{/* <div className="border-t pt-4 mt-4">
  <h3 className="text-lg font-bold mb-2">Salary Details</h3> */}
  
  {/* Basic Pay Section */}
  {/* <div>
    <label className="font-semibold text-gray-600 block mb-1">Basic Pay Amount</label>
    <input
      type="number"
      name="salaryData.basicPay.amount"
      value={newEmployeeData.salaryData?.basicPay?.amount || ""}
      onChange={(e) =>
        setNewEmployeeData({
          ...newEmployeeData,
          salaryData: {
            ...newEmployeeData.salaryData,
            basicPay: {
              ...newEmployeeData.salaryData?.basicPay,
              amount: e.target.value,
            },
          },
        })
      }
       className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
    />
    {requiredErrors.employeeId && <p className="text-red-500 text-xs mt-1">{requiredErrors.employeeId}</p>}
  </div> */}
  
  {/* PayScale (nested in BasicPay) */}
  {/* <div className="mt-2">
    <h4 className="font-semibold text-gray-700">PayScale Details</h4>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">Pay Commission ID</label>
      <input
        type="text"
        name="salaryData.basicPay.payScale.payCommission"
        value={newEmployeeData.salaryData?.basicPay?.payScale?.payCommission || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              basicPay: {
                ...newEmployeeData.salaryData?.basicPay,
                payScale: {
                  ...newEmployeeData.salaryData?.basicPay?.payScale,
                  payCommission: e.target.value,
                },
              },
            },
          })
        }
         className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
      />
    </div>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">Pay Level Code</label>
      <input
        type="text"
        name="salaryData.basicPay.payScale.payLevelCode"
        value={newEmployeeData.salaryData?.basicPay?.payScale?.payLevelCode || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              basicPay: {
                ...newEmployeeData.salaryData?.basicPay,
                payScale: {
                  ...newEmployeeData.salaryData?.basicPay?.payScale,
                  payLevelCode: e.target.value,
                },
              },
            },
          })
        }
         className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
      />
    </div>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">Scale Range</label>
      <input
        type="text"
        name="salaryData.basicPay.payScale.scaleRange"
        value={newEmployeeData.salaryData?.basicPay?.payScale?.scaleRange || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              basicPay: {
                ...newEmployeeData.salaryData?.basicPay,
                payScale: {
                  ...newEmployeeData.salaryData?.basicPay?.payScale,
                  scaleRange: e.target.value,
                },
              },
            },
          })
        }
         className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
      />
    </div>
  </div> */}
  
  {/* DA Section */}
  {/* <div className="mt-4">
    <h4 className="font-semibold text-gray-700">DA Details</h4>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">DA Percentage</label>
      <input
        type="number"
        name="salaryData.da.daPercentage"
        value={newEmployeeData.salaryData?.da?.daPercentage || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              da: {
                ...newEmployeeData.salaryData?.da,
                daPercentage: e.target.value,
              },
            },
          })
        }
         className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
      />
    </div>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">DA Effective Date</label>
      <input
        type="date"
        name="salaryData.da.effectiveDate"
        value={newEmployeeData.salaryData?.da?.effectiveDate || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              da: {
                ...newEmployeeData.salaryData?.da,
                effectiveDate: e.target.value,
              },
            },
          })
        }
         className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
      />
    </div>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">DA - Pay Commission ID</label>
      <input
        type="text"
        name="salaryData.da.payCommission"
        value={newEmployeeData.salaryData?.da?.payCommission || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              da: {
                ...newEmployeeData.salaryData?.da,
                payCommission: e.target.value,
              },
            },
          })
        }
         className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
      />
    </div>
  </div> */}
  
  {/* HRA Section */}
  {/* <div className="mt-4">
    <h4 className="font-semibold text-gray-700">HRA Details</h4>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">HRA Type</label>
      <input
        type="text"
        name="salaryData.hra.hraType"
        value={newEmployeeData.salaryData?.hra?.hraType || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              hra: {
                ...newEmployeeData.salaryData?.hra,
                hraType: e.target.value,
              },
            },
          })
        }
         className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
      />
    </div>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">HRA Percentage</label>
      <input
        type="number"
        name="salaryData.hra.hraPercentage"
        value={newEmployeeData.salaryData?.hra?.hraPercentage || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              hra: {
                ...newEmployeeData.salaryData?.hra,
                hraPercentage: e.target.value,
              },
            },
          })
        }
         className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
      />
    </div>
    <div>
      <label className="font-semibold text-gray-600 block mb-1">HRA Effective Date</label>
      <input
        type="date"
        name="salaryData.hra.effectiveDate"
        value={newEmployeeData.salaryData?.hra?.effectiveDate || ""}
        onChange={(e) =>
          setNewEmployeeData({
            ...newEmployeeData,
            salaryData: {
              ...newEmployeeData.salaryData,
              hra: {
                ...newEmployeeData.salaryData?.hra,
                effectiveDate: e.target.value,
              },
            },
          })
        }
         className={`border rounded w-full p-2 ${requiredErrors.employeeId ? "border-red-500" : "border-gray-300"}`}
      />
    </div>
  </div> */}
{/* </div> */}


  

          
  

          {/* Phone No */}
          <div>
  <label className="font-semibold text-gray-600 block mb-1">Phone No</label>
  <input
    type="text"
    name="phoneNo"
    value={newEmployeeData.phoneNo || ""}
    onChange={(e) => {
      const phone = e.target.value;
      if (!/^\d{0,10}$/.test(phone)) {
        setPhoneError("Phone number must be up to 10 digits only");
      } else {
        setPhoneError("");
        setRequiredErrors((prev) => ({ ...prev, phoneNo: "" }));
      }
      setNewEmployeeData({ ...newEmployeeData, phoneNo: phone });
    }}
    className={`border rounded w-full p-2 ${
      phoneError || requiredErrors.phoneNo ? "border-red-500" : "border-gray-300"
    }`}
  />
  {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
  {requiredErrors.phoneNo && <p className="text-xs text-red-500 mt-1">{requiredErrors.phoneNo}</p>}
</div>


          {/* Email */}
          <div>
  <label className="font-semibold text-gray-600 block mb-1">Email</label>
  <input
    type="email"
    name="email"
    value={newEmployeeData.email || ""}
    onChange={(e) => {
      const email = e.target.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
        setRequiredErrors((prev) => ({ ...prev, email: "" }));
      }
      setNewEmployeeData({ ...newEmployeeData, email });
    }}
    className={`border rounded w-full p-2 ${
      emailError || requiredErrors.email ? "border-red-500" : "border-gray-300"
    }`}
  />
  {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
  {requiredErrors.email && <p className="text-xs text-red-500 mt-1">{requiredErrors.email}</p>}
</div>







  {/* Credentials */}
      
  <div>
  <label className="font-semibold text-gray-600 block mb-1">Password</label>
  <div className="flex flex-col gap-y-2 items-start">
    <input
      type="text"
      value={newEmployeeData.credentials?.passwordHash || ""}
      onChange={(e) => {
        const password = e.target.value;
        if (password.length > 0 && password.length < 6) {
          setPasswordError("Password must be at least 6 characters");
        } else {
          setPasswordError("");
        }
        setNewEmployeeData({
          ...newEmployeeData,
          credentials: {
            ...newEmployeeData.credentials,
            passwordHash: password,
          },
        });
      }}
      className={`border rounded w-full p-2 ${passwordError ? "border-red-500" : "border-gray-300"}`}
    />
    {passwordError && (
      <p className="text-xs text-red-500 mt-1">{passwordError}</p>
    )}
    <button
      type="button"
      onClick={() => {
        const generated = Math.random().toString(36).slice(-8);
        setNewEmployeeData({
          ...newEmployeeData,
          credentials: {
            ...newEmployeeData.credentials,
            passwordHash: generated,
          },
        });
        setPasswordError("");
      }}
      className="bg-blue-500 text-nowrap text-[13px] font-medium text-white px-3 py-1 rounded"
    >
      Generate Password
    </button>
  </div>
</div>

      <div>
  <label className="font-semibold text-gray-600 block mb-1">
    Posting History
  </label>
  {newEmployeeData.postingHistory && newEmployeeData.postingHistory.length > 0 && (
    newEmployeeData.postingHistory.map((posting, index) => (
      <div key={index} className="border p-2 rounded mb-2">
        {/* Office ID */}
        <div>
        <label className="font-semibold text-gray-600 block mb-1">Posting Office</label>
        <Select
          options={officeOptions2}
          value={
            officeOptions2.find((opt) => String(opt.value) === String(posting.office)) || null
          }
          onChange={(selected) => {
            const updatedPosting = {
              ...posting,
              office: selected?.value || "",
            };
            const updatedPostings = [...(newEmployeeData.postingHistory || [])];
            updatedPostings[index] = updatedPosting;
            setNewEmployeeData({
              ...newEmployeeData,
              postingHistory: updatedPostings,
            });
          }}
          placeholder="Search and select office"
          className="text-sm mb-1"
        />

        </div>
        <div>
          <label className="font-semibold text-gray-600 block mb-1">Designation During Posting</label>
          <Select
            options={[
              ...teachingPosts.map((item) => ({ label: item, value: item })),
              ...nonTeachingPosts.map((item) => ({ label: item, value: item })),
            ]}
            value={
              posting.designationDuringPosting
                ? { label: posting.designationDuringPosting, value: posting.designationDuringPosting }
                : null
            }
            onChange={(selected) => {
              const updatedPosting = {
                ...posting,
                designationDuringPosting: selected?.value || "",
              };
              const updatedPostings = [...(newEmployeeData.postingHistory || [])];
              updatedPostings[index] = updatedPosting;
              setNewEmployeeData({
                ...newEmployeeData,
                postingHistory: updatedPostings,
              });
            }}
            placeholder="Select Designation"
            className="text-sm mb-1"
          />
        </div>
        <div>
          <label className="font-semibold text-gray-600 block mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={posting.startDate ? posting.startDate.substring(0, 10) : ""}
            onChange={(e) => {
              const updatedPosting = { ...posting, startDate: e.target.value };
              const updatedPostings = [...(newEmployeeData.postingHistory || [])];
              updatedPostings[index] = updatedPosting;
              setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
            }}
            className="border rounded text-sm  w-full p-1"
          />
        </div>
        {/* End Date */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={posting.endDate ? posting.endDate.substring(0, 10) : ""}
            onChange={(e) => {
              const updatedPosting = { ...posting, endDate: e.target.value };
              const updatedPostings = [...(newEmployeeData.postingHistory || [])];
              updatedPostings[index] = updatedPosting;
              setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
            }}
            className="border rounded w-full p-1 mb-1"
          />
        </div>
        {/* Posting Type */}
        <select
          name="postingType"
          value={posting.postingType || ""}
          onChange={(e) => {
            const updatedPosting = { ...posting, postingType: e.target.value };
            const updatedPostings = [...(newEmployeeData.postingHistory || [])];
            updatedPostings[index] = updatedPosting;
            setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
          }}
          className="border rounded w-full p-1 mb-1"
        >
          <option value="">Select Posting Type</option>
          <option value="Transfer">Transfer</option>
          <option value="Deputation">Deputation</option>
          <option value="Attachment">Attachment</option>
          <option value="Other">Other</option>
        </select>
        {/* Reason */}
        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={posting.reason || ""}
          onChange={(e) => {
            const updatedPosting = { ...posting, reason: e.target.value };
            const updatedPostings = [...(newEmployeeData.postingHistory || [])];
            updatedPostings[index] = updatedPosting;
            setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
          }}
          className="border rounded w-full p-1 mb-1"
        />
        {/* Remarks */}
        <input
          type="text"
          name="remarks"
          placeholder="Remarks"
          value={posting.remarks || ""}
          onChange={(e) => {
            const updatedPosting = { ...posting, remarks: e.target.value };
            const updatedPostings = [...(newEmployeeData.postingHistory || [])];
            updatedPostings[index] = updatedPosting;
            setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
          }}
          className="border rounded w-full p-1 mb-1"
        />
        <button
          onClick={() => {
            const updatedPostings = newEmployeeData.postingHistory.filter((_, idx) => idx !== index);
            setNewEmployeeData({ ...newEmployeeData, postingHistory: updatedPostings });
          }}
          className="text-red-500 text-xs"
        >
          Remove
        </button>
      </div>
    ))
  )}
  <button
    onClick={() => {
      const newPosting = {
        office: "",
        designationDuringPosting: "",
        startDate: "",
        endDate: "",
        postingType: "",
        reason: "",
        remarks: "",
      };
      setNewEmployeeData({
        ...newEmployeeData,
        postingHistory: [...(newEmployeeData.postingHistory || []), newPosting],
      });
    }}
    className=" bg-blue-500 text-nowrap text-[13px] font-medium text-white px-3 py-1 rounded"
  >
    Add Posting History
  </button>
</div>

          
        </div>
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSave}
            className="font-semibold text-[13px] px-4 py-2 bg-primary text-white rounded transition hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="font-semibold text-[13px] px-4 py-2 transition bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
