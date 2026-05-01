  "use client";

  import { useParams, useRouter } from "next/navigation";
  import { useState, useEffect, useRef } from "react";
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import { Building, ChevronLeft, User } from "lucide-react";
  import EmployeeEditForm from "@/components/school-status/EmployeeEditForm";
  import EmployeeTransferForm from "@/components/school-status/EmployeeTransferForm";
  import districtData from "@/data/data.json"; // Used only for schools list in transfer form
  import { useUser } from "@/context/UserContext";
  import { createTransferRequest } from "@/api/transferService";
  import { toast, ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";

  // --- Backend fetch functions ---

  // Fetch employee details using your getEmployeeById endpoint
  const token = localStorage.getItem("token");
console.log("Token from localStorage:", token);

  const fetchEmployeeDetails = async (employeeId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch employee details");
    }
    return res.json();
  };

  async function handleImageUpload(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads`, {  // ✅ Make sure this matches your backend
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Upload failed:", errorText);
      throw new Error("Failed to upload image: " + errorText);
    }

    const data = await res.json();
    return data.url;
  }


  // Update employee details via backend (PUT endpoint)
  const updateEmployeeDetails = async ({ employeeId, updatedData }) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error("Failed to update employee: " + errorText);
    }
    return res.json();
  };

  



  // --- Main Component ---
  export default function EmployeeDetailPage() {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const {employeeId } = useParams(); 
    const queryClient = useQueryClient();
    const { user } = useUser();
    const fileInputRef = useRef(null);
    console.log("user office id",user?.officeId);
    const handleUploadProfilePicture = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    
    
    const schoolId = user?.schoolId;
    const {
      data: employeeData,
      isLoading: employeeLoading,
      error: employeeError,
    } = useQuery({
      queryKey: ["employee", employeeId],
      queryFn: () => fetchEmployeeDetails(employeeId),
      refetchOnWindowFocus: false,
    });

    // Local state for employee details (populated from backend)
    const [employee, setEmployee] = useState(null);
    const [postingHistory, setPostingHistory] = useState([]);

    // State to control edit and transfer modes
    const [isEditMode, setIsEditMode] = useState(false);
    const [isTransferMode, setIsTransferMode] = useState(false);

    // Mutation for updating employee details
    const updateMutation = useMutation({
      mutationFn: ({ employeeId, updatedData }) =>
        updateEmployeeDetails({ employeeId, updatedData }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
        setIsEditMode(false);
      },
    });

    const transferMutation = useMutation({
      mutationFn: (transferData) =>
        createTransferRequest(transferData, user, window.location.hostname),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["employee", employeeId] });
        toast.success("Transfer request submitted successfully");
        setIsTransferMode(false);
      },
      onError: (error) => {
        toast.error("Error submitting transfer request: " + error.message);
      },
    });
    
   
    const handleSubmitTransfer = (formData) => {
      const payload = {
        employee: employeeId,
        fromOffice: user?.officeId,
        toOffice: formData.get("toOfficeId"),
        transferType: formData.get("transferType"),
        transferDate: formData.get("transferDate"),
        transferReason: formData.get("transferReason"),
        transferOrderNo: formData.get("transferOrderNo"),
        transferOrderDate: formData.get("transferOrderDate"),
        transferOrder: formData.get("transferOrder"), 
      };
    
      console.log("Payload:", payload);
      transferMutation.mutate(payload);
    };
    
    

    const handleSaveEdit = (updatedData) => {
      updateMutation.mutate({ employeeId, updatedData });
    };


    
    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        setIsUploading(true);
        const photoUrl = await handleImageUpload(file);
        console.log("Uploaded photo URL:", photoUrl);
        updateMutation.mutate(
          { employeeId: employee._id, updatedData: { photograph: photoUrl } },
          {
            onSuccess: () => {
              setIsUploading(false);
              toast.success("Profile picture updated successfully");
            },
            onError: (error) => {
              setIsUploading(false);
              console.error("Error updating profile picture:", error);
              toast.error(error.message);
            },
          }
        );
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error(error.message);
      }
    };

    const { data: postingHistoryData, isLoading: postingLoading, error: postingError } = useQuery({
      queryKey: ["postingHistory", employeeId],
      queryFn: async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/postingHistory/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch posting history");
        }
        const data = await res.json();
        console.log("Posting History Data:", data);
        return data.history || []; 
      },
      refetchOnWindowFocus: false,
    });
    
    useEffect(() => {
      if (employeeData) setEmployee(employeeData);
      if (postingHistoryData) setPostingHistory(postingHistoryData);
    }, [employeeData, postingHistoryData]);

    
console.log("employee:",employee);
    
    if (employeeLoading || !employee) {
      return (
        <div className="flex justify-center items-center h-full">
              <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
            </div>
      );
    }
    if (employeeError || !employee) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Employee not found.</p>
        </div>
      );
    }

    console.log("employees-page:",employee);

   
    const allSchools = districtData.zones.flatMap((zone) =>
      zone.schools.map((school) => ({ ...school, zone: zone.zone }))
    );
    const filteredSchools = allSchools.filter(
      (sch) => sch.id !== parseInt(schoolId, 10)
    );

    return (
      <div className="min-h-screen  capitalize">
        <ToastContainer />
        <div className="">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center text-[15px] font-semibold rounded-md text-secondary hover:text-primary transition"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </button>

          
          <div className="bg-white shadow-sm border-l-4 border-primary rounded-lg p-6 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {employee.photograph ? (
                <img
                  src={employee.photograph}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-800">{employee.fullName}</h1>
            </div>
            {user?.officeId === employee?.office?._id && <div className="flex  gap-2">
              {!isEditMode && !isTransferMode && (
                <>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="font-semibold text-[13px] px-4 py-2 bg-primary transition text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setIsTransferMode(true)}
                    className="font-semibold text-[13px] px-4 py-2 bg-red-500 transition text-white rounded hover:bg-red-600"
                  >
                    Transfer
                  </button>
                </>
              )}
              <button
      onClick={handleUploadProfilePicture}
      className={`font-semibold text-[13px] px-4 py-2 transition text-white rounded ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"}`}
      disabled={isUploading}
  >
      {isUploading ? "Uploading..." : "Upload Profile Picture"}
  </button>
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>}
          </div>

          
          {isEditMode && (
            <EmployeeEditForm
              initialData={employee}
              postingHistoryData={postingHistory}
              onSave={handleSaveEdit}
              onCancel={() => setIsEditMode(false)}
            />
          )}

         
          {isTransferMode && (
            <EmployeeTransferForm
              onSubmit={handleSubmitTransfer}
              onCancel={() => setIsTransferMode(false)}
              employeeId={employeeId}
            />
          )}

          
          {!isEditMode && !isTransferMode && (
    <div className="bg-white shadow rounded-lg p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      <div className="space-y-8">
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-primary mb-2">Personal Details</h2>
          <p><span className="font-semibold text-gray-600 mr-1">Employee ID:</span><span className="text-gray-600 font-medium">{employee.employeeId}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Full Name:</span><span className="text-gray-600 font-medium">{employee.fullName || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Gender:</span><span className="text-gray-600 font-medium">{employee.gender || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Marital Status:</span><span className="text-gray-600 font-medium">{employee.maritalStatus || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Parentage/Spouse:</span><span className="text-gray-600 font-medium">{employee.parentageOrSpouse || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Phone Number:</span><span className="text-gray-600 font-medium">{employee.phoneNo || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Email:</span><span className="text-gray-600 font-medium" style={{ textTransform: 'none' }}>{employee.email || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Date of Birth:</span><span className="text-gray-600 font-medium">{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Staff Type:</span><span className="text-gray-600 font-medium">{employee.staffType || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Password:</span><span className="text-gray-600 font-medium" style={{ textTransform: 'none' }}>{employee.credentials.passwordHash || "N/A"}</span></p>
        </div>
  
       
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-primary mb-2">Official & Designation</h2>
          <p><span className="font-semibold text-gray-600 mr-1">Posted Office:</span><span className="text-gray-600 font-medium">{employee.postedOffice.officeName || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Working Office:</span><span className="text-gray-600 font-medium">{employee.office.officeName || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Present Designation:</span><span className="text-gray-600 font-medium">{employee.presentDesignation || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Date of First Appointment:</span><span className="text-gray-600 font-medium">{employee.dateOfFirstAppointment ? new Date(employee.dateOfFirstAppointment).toLocaleDateString() : "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Designation at First Appointment:</span><span className="text-gray-600 font-medium">{employee.designationAtFirstAppointment || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Latest Promotion:</span><span className="text-gray-600 font-medium">{employee.dateOfRecentPromotion ? new Date(employee.dateOfRecentPromotion).toLocaleDateString() : "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Actual Place of Posting:</span><span className="text-gray-600 font-medium">{employee.actualPlaceOfPosting || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Basis of Work:</span><span className="text-gray-600 font-medium">{employee.basisOfWork || "N/A"}</span></p>
        </div>
  
       
        
      </div>
  
      <div className="space-y-8">
      <div className="space-y-3">
          <h2 className="text-lg font-bold text-primary mb-2">Retirement Information</h2>
          <p><span className="font-semibold text-gray-600 mr-1">Retirement Date:</span><span className="text-gray-600 font-medium">{employee.dateOfRetirement ? new Date(employee.dateOfRetirement).toLocaleDateString() : "N/A"}</span></p>
        </div>
       
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-primary mb-2">Education</h2>
          <p><span className="font-semibold text-gray-600 mr-1">Highest Qualification:</span><span className="text-gray-600 font-medium">{employee.highestQualification || "N/A"}</span></p>
          {employee.highestQualification && !["10TH", "12TH"].includes(employee.highestQualification.toUpperCase()) && (
            <>
              <p>
                <span className="font-semibold text-gray-600 mr-1">
                  {employee.highestQualification.toUpperCase() === "PHD" ? "Specialization (Enter Text):" : "Specialization Subject:"}
                </span>
                <span className="text-gray-600 font-medium">{employee.specializationSubject || "N/A"}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-600 mr-1">{employee.highestQualification.toUpperCase()} University:</span>
                <span className="text-gray-600 font-medium">{employee.pgUniversity || "N/A"}</span>
              </p>
            </>
          )}
          <p><span className="font-semibold text-gray-600 mr-1">B.Ed:</span><span className="text-gray-600 font-medium">{employee.bed ? "Yes" : "No"}</span></p>
          {employee.bed && (
            <p><span className="font-semibold text-gray-600 mr-1">B.Ed University:</span><span className="text-gray-600 font-medium">{employee.bedUniversity || "N/A"}</span></p>
          )}
          <p><span className="font-semibold text-gray-600 mr-1">Any Other Certification:</span><span className="text-gray-600 font-medium">{employee.anyOtherCertification || "N/A"}</span></p>
        </div>
  
       
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-primary mb-2">Salary Details</h2>
          <p><span className="font-semibold text-gray-600 mr-1">Date From Which Working in Current Office:</span><span className="text-gray-600 font-medium">{employee.dateOfCurrentPosting ? new Date(employee.dateOfCurrentPosting).toLocaleDateString() : "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Current Payscale and Level:</span><span className="text-gray-600 font-medium">{employee.payScaleAndLevel || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Current Basic Pay:</span><span className="text-gray-600 font-medium">{employee.basicPay || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Gross Salary:</span><span className="text-gray-600 font-medium">{employee.grossSalary || "N/A"}</span></p>
          <p><span className="font-semibold text-gray-600 mr-1">Pension Scheme:</span><span className="text-gray-600 font-medium">{employee.pensionScheme || "N/A"}</span></p>
        </div>
      </div>
    </div>
  
   
    <div className=" mt-12  font-medium">
  <h3 className="text-xl font-bold text-gray-800 mb-2">Posting History</h3>
  <p className="text-gray-500 text-sm mb-8">Your postings in a timeline</p>

  {postingLoading ? (
    <div className="flex justify-center items-center h-full">
      <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
    </div>
  ) : postingError ? (
    <p className="text-gray-600">Error loading postings.</p>
  ) : postingHistoryData && postingHistoryData.length > 0 ? (
    <div className="relative border-l-[3px] border-dashed border-gray-300 ml-6 text-sm">
      {postingHistoryData.slice(0, 3).map((posting, index) => (
        <div key={posting._id || index} className="mb-10 ml-8 flex">
          <span className="flex absolute -left-[19px] justify-center items-center p-2 rounded-full bg-blue-100 ring-2 ring-primary">
            <Building className="w-5 h-5 text-blue-600" />
          </span>
          <div className="flex flex-col gap-y-1">
            <time className="block mb-2 text-xs font-semibold leading-none text-gray-400">
              {posting.startDate
                ? new Date(posting.startDate).toLocaleDateString()
                : "Start N/A"}{" "}
              -{" "}
              {posting.endDate
                ? new Date(posting.endDate).toLocaleDateString()
                : "End N/A"}
            </time>
            <h3 className="text-[15px] font-semibold text-gray-900">
              {posting.office?.officeName || "N/A"} (
              {posting.office?.officeType || "N/A"})
            </h3>
            <p className="text-[13px] font-medium text-gray-500">
              Designation: {posting.designationDuringPosting || "N/A"}
            </p>
            {posting.postingType && (
              <p className="text-[13px] text-gray-500">
                Type: {posting.postingType}
              </p>
            )}
            {posting.reason && (
              <p className="text-[13px] text-gray-500">
                Reason: {posting.reason}
              </p>
            )}
            {posting.remarks && (
              <p className="text-[13px] text-gray-500">
                Remarks: {posting.remarks}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-600">No postings found.</p>
  )}
</div>
  </div>
  
  )}

        </div>
      </div>
    );
  }
