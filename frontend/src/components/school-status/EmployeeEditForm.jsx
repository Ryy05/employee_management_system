import React, {useState, useEffect} from "react";
import { staffTypes,highestQualificationOptions,teachingPosts,nonTeachingPosts,pgSpecializationOptions,currentPayscaleOptions,pensionSchemeOptions,basicPayByPayscale } from "@/data/options";
import Select from "react-select";
import axiosClient from "@/api/axiosClient";



const genderOptions = ["Male", "Female", "Other"];

const maritalStatusOptions = ["Married", "Unmarried"];

export default function EmployeeEditForm({ initialData,postingHistoryData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    ...initialData,
    postingHistory: postingHistoryData || []
  });

  

  const handleSave = () => {
    const transformedPostingHistory = (formData.postingHistory || []).map(posting => {
      // Use posting.office?.officeId if available, or posting.office if it is already an _id.
      const officeId = posting.office?.officeId || posting.office;
      const matchedOffice = offices.find(o => String(o._id) === String(officeId));
      return {
        ...posting,
        // Assign the matched office's _id as the office value.
        office: matchedOffice ? matchedOffice._id : "",
        postingType: posting.postingType?.toLowerCase() || "",
      };
    });
    
    // Check if any posting is missing a valid office:
    const isAnyPostingMissingOffice = transformedPostingHistory.some(p => !p.office);
    if (isAnyPostingMissingOffice) {
      alert("One or more postings are missing a valid office selection.");
      return;
    }
  
    onSave({
      ...formData,
      postingHistory: transformedPostingHistory,
    });
  };
  
  
  
  

  const [officeOptions, setOfficeOptions] = useState([]);
  const [offices, setOffices] = useState([]);

  
  console.log("Form Data:", formData);

    useEffect(() => {
      const fetchOffices = async () => {
        try {
          const response = await axiosClient.get("/offices");
          console.log("Fetched Offices:", response.data.offices);
          const options = response.data.offices.map((office) => ({
            value: office._id,
            label: `${office.officeName}`
          }));
          setOffices(response.data.offices);
          setOfficeOptions(options);
        } catch (err) {
          console.error("Error fetching offices:", err);
        }
      };
      fetchOffices();
    }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        postingHistory: postingHistoryData || [], 
      });
    }
  }, [initialData, postingHistoryData]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 gap-6 text-sm">
      {/* Employee ID */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Employee ID</label>
        <input type="text" name="employeeId" value={formData.employeeId || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Full Name */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Full Name</label>
        <input type="text" name="fullName" value={formData.fullName || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Gender */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Gender</label>
        <select name="gender" value={formData.gender || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Gender</option>
          {genderOptions.map((g, idx) => <option key={idx} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Marital Status */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Marital Status</label>
        <select name="maritalStatus" value={formData.maritalStatus || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Marital Status</option>
          {maritalStatusOptions.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Parentage/Spouse */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Parentage/Spouse</label>
        <input type="text" name="parentageOrSpouse" value={formData.parentageOrSpouse || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Phone Number */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Phone Number</label>
        <input type="text" name="phoneNo" value={formData.phoneNo || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Email */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Email</label>
        <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Date of Birth */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Date of Birth</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().substring(0, 10) : ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Staff Type */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Staff Type</label>
        <select name="staffType" value={formData.staffType || ""} onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            staffType: e.target.value,
            // Reset designation fields when staff type changes
            presentDesignation: "",
            designationAtFirstAppointment: ""
          }));
        }} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Staff Type</option>
          {staffTypes.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="font-semibold text-gray-600 block mb-1">Post Category</label>
        <select name="postCategory" value={formData.postCategory || ""} onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            postCategory: e.target.value,
          }));
        }} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Post Category</option>
          <option value="Gazetted">Gazetted</option>
          <option value="Non-Gazetted">Non-Gazetted</option>
        </select>
      </div>


      {/* Present Designation */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Present Designation</label>
        <select name="presentDesignation" value={formData.presentDesignation || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Designation</option>
          {formData.staffType === "Teaching"
            ? teachingPosts.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)
            : nonTeachingPosts.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
        </select>
      </div>

      {/* Designation at First Appointment */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Designation at First Appointment</label>
        <input type="text" name="designationAtFirstAppointment" value={formData.designationAtFirstAppointment || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Date of First Appointment */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Date of First Appointment</label>
        <input type="date" name="dateOfFirstAppointment" value={formData.dateOfFirstAppointment ? new Date(formData.dateOfFirstAppointment).toISOString().substring(0, 10) : ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Date of Recent Promotion */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Date of Recent Promotion</label>
        <input type="date" name="dateOfRecentPromotion" value={formData.dateOfRecentPromotion ? new Date(formData.dateOfRecentPromotion).toISOString().substring(0, 10) : ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Date of Retirement */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Date of Retirement</label>
        <input type="date" name="dateOfRetirement" value={formData.dateOfRetirement ? new Date(formData.dateOfRetirement).toISOString().substring(0, 10) : ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Actual Place of Posting */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Actual Place of Posting</label>
        <input type="text" name="actualPlaceOfPosting" value={formData.actualPlaceOfPosting || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Posted Office */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Posted Office</label>
        <Select
          options={officeOptions}
          value={officeOptions.find(opt => opt.value === formData.postedOffice) || null}
          onChange={(selected) =>
            setFormData(prev => ({ ...prev, postedOffice: selected?.value || "" }))
          }
          placeholder="Search and select office"
          className="text-sm"
        />
      </div>

      {/* Working Office */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Working Office</label>
        <Select
          options={officeOptions}
          value={officeOptions.find(opt => opt.value === formData.workingOffice) || null}
          onChange={(selected) =>
            setFormData(prev => ({ ...prev, workingOffice: selected?.value || "" }))
          }
          placeholder="Search and select office"
          className="text-sm"
        />
      </div>


      {/* Working At */}
      {/* <div>
        <label className="font-semibold text-gray-600 block mb-1">Working At</label>
        <input type="text" name="workingAt" value={formData.workingAt || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div> */}

      {/* Basis of Work */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Basis of Work</label>
        <select
          name="basisOfWork"
          value={formData.basisOfWork || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full p-2"
        >
          <option value="">Select Basis of Work</option>
          <option value="DEPUTED">DEPUTED</option>
          <option value="FILLED">FILLED</option>
          <option value="SUPERNUMERARY">SUPERNUMERARY</option>
          <option value="PAYORDER">PAYORDER</option>
          <option value="OTHER">OTHER</option>
        </select>
      </div>


      {/* Highest Qualification */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Highest Qualification</label>
        <select name="highestQualification" value={formData.highestQualification || ""} onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            highestQualification: e.target.value,
            // If 10TH or 12TH, reset specialization fields
            specializationSubject: (e.target.value === "10TH" || e.target.value === "12TH") ? "" : prev.specializationSubject,
            pgUniversity: ""  // reset PG University
          }));
        }} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Qualification</option>
          {highestQualificationOptions.map((qual, idx) => (
            <option key={idx} value={qual}>{qual}</option>
          ))}
        </select>
      </div>

      {/* Specialization Subject (if applicable) */}
      {formData.highestQualification && !["10TH", "12TH"].includes(formData.highestQualification) && (
        <div>
          <label className="font-semibold text-gray-600 block mb-1">
            {formData.highestQualification === "PHD" ? "Specialization (Enter Text)" : "Specialization Subject"}
          </label>
          {formData.highestQualification === "PHD" ? (
            <input type="text" name="specializationSubject" value={formData.specializationSubject || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
          ) : (
            <select name="specializationSubject" value={formData.specializationSubject || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
              <option value="">Select Specialization Subject</option>
              {pgSpecializationOptions.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          )}
        </div>
      )}

      {/* PG University (only if qualification is not 10TH or 12TH) */}
      {formData.highestQualification && !["10TH", "12TH"].includes(formData.highestQualification) && (
        <div>
          <label className="font-semibold text-gray-600 block mb-1">{formData.highestQualification} University</label>
          <input type="text" name="pgUniversity" value={formData.pgUniversity || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
        </div>
      )}

      {/* B.Ed */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">B.Ed</label>
        <select name="bed" value={formData.bed || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      {formData.bed === "Yes" && (
        <div>
          <label className="font-semibold text-gray-600 block mb-1">B.Ed University</label>
          <input type="text" name="bedUniversity" value={formData.bedUniversity || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
        </div>
      )}

      {/* Any Other Certification */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Any Other Certification</label>
        <input type="text" name="otherCertification" value={formData.otherCertification || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Date From Which Working in Current Office */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Working Since (Current Office)</label>
        <input type="date" name="dateOfCurrentPosting" value={formData.dateOfCurrentPosting ? new Date(formData.dateOfCurrentPosting).toISOString().substring(0, 10) : ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Current Payscale and Level */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Current Payscale and Level</label>
        <select name="currentPayScaleAndLevel" value={formData.currentPayScaleAndLevel || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Payscale and Level</option>
          {currentPayscaleOptions.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Current Basic Pay */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Current Basic Pay</label>
        <select
          name="basicPay"
          value={formData.basicPay || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full p-2"
          disabled={!formData.payScaleAndLevel}
        >
          <option value="">Select Basic Pay</option>
          {(basicPayByPayscale[formData.payScaleAndLevel] || []).map((pay, idx) => (
            <option key={idx} value={pay}>{pay}</option>
          ))}
        </select>
      </div>


      {/* Gross Salary */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Gross Salary</label>
        <input type="text" name="grossSalary" value={formData.grossSalary || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2" />
      </div>

      {/* Pension Scheme */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Pension Scheme</label>
        <select name="pensionScheme" value={formData.pensionScheme || ""} onChange={handleChange} className="border border-gray-300 rounded w-full p-2">
          <option value="">Select Pension Scheme</option>
          {pensionSchemeOptions.map((scheme, idx) => (
            <option key={idx} value={scheme}>{scheme}</option>
          ))}
        </select>
      </div>

      {/* Credentials - Password */}
      <div>
        <label className="font-semibold text-gray-600 block mb-1">Password</label>
        <div className="flex">
          <input type="text" name="credentials.passwordHash" value={formData.credentials?.passwordHash || ""} onChange={(e) => setFormData(prev => ({ ...prev, credentials: { ...prev.credentials, passwordHash: e.target.value } }))} className="border border-gray-300 rounded w-full p-2" />
          <button type="button" onClick={() => {
            const generated = Math.random().toString(36).slice(-8);
            setFormData(prev => ({ ...prev, credentials: { ...prev.credentials, passwordHash: generated } }));
          }} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
            Generate Password
          </button>
        </div>
      </div>

      
      
      {/* Posting Details Section */}
<div>
  <label className="font-semibold text-gray-600 block mb-1">Posting History</label>
  {(formData.postingHistory || []).length > 0 && (formData.postingHistory || []).map((posting, index) => (
      <div key={index} className="border p-2 rounded mb-2">
        <div>
          <label className="font-semibold text-gray-600 block mb-1">Posting Office</label>
          <Select
            options={officeOptions}
            value={
              posting.office?.officeId
                ? {
                    value: posting.office.officeId,
                    label:
                      posting.office.officeName ||
                      officeOptions.find(opt => opt.value === posting.office.officeId)?.label ||
                      "Unknown Office",
                  }
                : null
            }            
            onChange={(selected) => {
              const updatedPosting = {
                ...posting,
                office: {
                  ...posting.office,
                  officeId: selected?.value || "",
                  officeName: selected?.label || "" // optional: auto-fill name
                }
              };
              const updatedPostings = (formData.postingHistory || []).map((p, i) =>
                i === index ? updatedPosting : p
              );
              setFormData({ ...formData, postingHistory: updatedPostings });
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
              const fakeEvent = {
                target: {
                  name: "designationDuringPosting",
                  value: selected?.value || "",
                },
              };

              const updatedPosting = { ...posting, designationDuringPosting: fakeEvent.target.value };
              const updatedPostings = (formData.postingHistory || []).map((p, i) =>
                i === index ? updatedPosting : p
              );
              setFormData({ ...formData, postingHistory: updatedPostings });
            }}
            placeholder="Select Designation"
            className="text-sm mb-1"
          />
        </div>
        <div>
        <label className="font-semibold text-gray-600 block mb-1">Posting Type</label>
        <select
          name="postingType"
          value={posting.postingType || ""}
          onChange={(e) => {
            const updatedPosting = { ...posting, postingType: e.target.value };
            const updatedPostings = formData.postingHistory.map((p, i) =>
              i === index ? updatedPosting : p
            );
            setFormData({ ...formData, postingHistory: updatedPostings });
          }}
          className="border rounded w-full p-1 mb-1"
        >
          <option value="">Select Posting Type</option>
          <option value="Transfer">Transfer</option>
          <option value="Promotion">Promotion</option>
          <option value="Deputation">Deputation</option>
          <option value="Initial">Initial</option>
        </select>
      </div>
        <div>
        <label className="font-semibold text-gray-600 block mb-1">Start Date</label>
        <input 
          type="date" 
          name="startDate" 
          value={posting.startDate ? posting.startDate.substring(0, 10) : ""} 
          onChange={(e) => {
            const updatedPosting = { ...posting, startDate: e.target.value };
            const updatedPostings =(formData.postingHistory || []).map((p, i) =>
              i === index ? updatedPosting : p
            );
            setFormData({ ...formData, postingHistory: updatedPostings });
          }} 
          className="border rounded w-full p-1 mb-1" 
        />
        </div>
        <div>
        <label className="font-semibold text-gray-600 block mb-1">End Date</label>
        <input 
          type="date" 
          name="endDate" 
          value={posting.endDate ? posting.endDate.substring(0, 10) : ""} 
          onChange={(e) => {
            const updatedPosting = { ...posting, endDate: e.target.value };
            const updatedPostings =(formData.postingHistory || []).map((p, i) =>
              i === index ? updatedPosting : p
            );
            setFormData({ ...formData, postingHistory: updatedPostings });
          }} 
          className="border rounded w-full p-1 mb-1" 
        />
        </div>

        <div>
          <label className="font-semibold text-gray-600 block mb-1">Reason</label>
          <input
            type="text"
            name="reason"
            value={posting.reason || ""}
            onChange={(e) => {
              const updatedPosting = { ...posting, reason: e.target.value };
              const updatedPostings = (formData.postingHistory || []).map((p, i) =>
                i === index ? updatedPosting : p
              );
              setFormData({ ...formData, postingHistory: updatedPostings });
            }}
            className="border rounded w-full p-1 mb-1"
          />
        </div>

        {/* Remarks */}
        <div>
          <label className="font-semibold text-gray-600 block mb-1">Remarks</label>
          <input
            type="text"
            name="remarks"
            value={posting.remarks || ""}
            onChange={(e) => {
              const updatedPosting = { ...posting, remarks: e.target.value };
              const updatedPostings = (formData.postingHistory || []).map((p, i) =>
                i === index ? updatedPosting : p
              );
              setFormData({ ...formData, postingHistory: updatedPostings });
            }}
            className="border rounded w-full p-1 mb-1"
          />
        </div>

        <button
        onClick={() => {
          const updatedPostings = formData.postingHistory.filter((_, i) => i !== index);
          setFormData({ ...formData, postingHistory: updatedPostings });
        }}
        className="text-red-500 text-xs"
      >
          Remove
        </button>

      </div>
    ))
  }

<button
    onClick={() => {
      const newPosting = {
        office: { officeId: "", officeName: "" },
        designationDuringPosting: "",
        startDate: "",
        endDate: "",
        postingType: "", 
        reason: "",
        remarks: ""
      };
      const updatedPostings = [...(formData.postingHistory || []), newPosting];
      setFormData({ ...formData, postingHistory: updatedPostings });
    }}
    className="bg-blue-500 text-white px-3 py-1 rounded text-sm mt-2"
  >
  Add Posting
</button>

</div>




            <div className="mt-4 flex gap-4">
              <button onClick={handleSave} className="font-semibold text-[13px] px-4 py-2 bg-primary text-white rounded transition hover:bg-blue-600">
                Save
              </button>
              <button onClick={onCancel} className="font-semibold text-[13px] px-4 py-2 transition bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </div>
  );
}
