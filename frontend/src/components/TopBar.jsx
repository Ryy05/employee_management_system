import { useState, useRef } from "react";
import { User, Settings, LogOut, Search, BellRingIcon, User2, Lock } from "lucide-react";
import Link from "next/link";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
export function TopBar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const { user } = useUser();
  const userId = user?.userId;
  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const fetchUserDetails = async (userId) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user details");
    }
    return res.json();
  };
  
  

  useOutsideClick(dropdownRef, () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    }
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["userDetails", userId],
    queryFn: () => fetchUserDetails(userId),
    enabled: !!userId,
  });


  

  const userDetails = data?.user;
  console.log("userDetails:", userDetails);

  const { data: loginData } = useQuery({
    queryKey: ["lastLogin", userDetails?.userName],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logs/user/${userDetails?.userName}/last-login`)
        .then((res) => res.json()),
    enabled: !!userDetails?.userName,
  });

  const { data: officeData, isLoading: isOfficeLoading } = useQuery({
    queryKey: ["officeDetails", userDetails?.office],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/offices/${userDetails?.office}`)
        .then((res) => res.json()),
    enabled: !!userDetails?.office,
  });

  console.log("officeData:", officeData); 
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
const [newPassword, setNewPassword] = useState("");

const handlePasswordUpdate = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to update password");

    alert("Password updated successfully");
    setShowPasswordModal(false);
    setNewPassword("");
  } catch (err) {
    alert(err.message);
  }
};


  return (<>
  {showPasswordModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <button
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        onClick={() => setShowPasswordModal(false)}
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Change Password</h2>
      <input
        type="password"
        className="w-full border px-3 py-2 rounded-md mb-4 outline-none text-sm"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button
        onClick={handlePasswordUpdate}
        className="w-full bg-[#377DFF] text-white py-2 rounded-md hover:bg-blue-600 transition text-sm font-medium"
      >
        Update Password
      </button>
    </div>
  </div>
)}

    <header className="bg-white shadow-lg">
  <div className="sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <div className="text-xl font-bold text-secondary">
        Welcome
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text font-semibold text-gray-800">
            {isLoading
              ? "Loading..."
              : userDetails?.userName || "Welcome"}
          </p>
          {/* <p className="text-xs text-gray-500">
            {isLoading
              ? "Loading..."
              : userDetails?.role
              ? `Role: ${userDetails.role}`
              : "You are not logged in"}
          </p> */}
          <p className="text-xs text-gray-400 mt-1">
            Last login: {loginData?.lastLogin || "N/A"}
          </p>
        </div>

        
        <div className="flex items-center">
            <div className="relative ">
              <button
                onClick={toggleDropdown}
                className="relative flex  w-10 h-10 items-center justify-center bg-gray-200 text-gray-600 font-semibold uppercase rounded-full group  hover:bg-[#377DFF] hover:text-white transition  border "
              >
                {userDetails?.userName?.[0] || "U"}
                
              </button>

              <div
              ref={dropdownRef}
                className={`absolute right-0 w-56 mt-2 bg-white border shadow-lg rounded-md ${
                  dropdownVisible
                    ? "transform translate-y-0 opacity-100"
                    : "transform translate-y-4 opacity-0 hidden"
                } transition-all duration-300 ease-out`
              }
              style={{ zIndex: 9999 }}
              >
                <div className="p-4 space-y-1">
                  <p className="text-sm font-medium leading-none mb-1">Username: {userDetails?.userName}</p>
                  <p className="text-xs text-muted-foreground">Role: {userDetails?.role}</p>
                  <p className="text-xs text-muted-foreground">Office: {officeData?.office.officeName}</p>
                  {officeData?.office.ddoCode && <p className="text-xs text-muted-foreground">DDO Code: {officeData?.office.ddoCode}</p>}
                </div>
                <div className="border-t py-2">
                  <ul>
                    <li>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </button>
                    </li>
                    <li>
                      <Link href="/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</header>
</>

  );
}

{/* <div className="flex mr-8 w-72">
            <div className="flex items-center w-full">
            <div className="flex items-center p-1 rounded-full bg-white   text-[13px] border relative w-full">
          <input
            type="text"
            placeholder="Search by School, Employee..."
            className="flex-grow px-3 py-[3px] text-gray-700 placeholder-gray-500 bg-transparent outline-none rounded-full"
          />
          <button className="p-2 rounded-full bg-[#377DFF] text-white hover:bg-[#3f68b4] focus:outline-none flex transition">
          <Search className="w-4 h-4" style={{ strokeWidth: 2.6 }} />

          </button>
        </div>
            </div>
          </div> */}
          {/* <div className="flex items-center justify-center p-2 border hover:bg-[#377DFF] group cursor-pointer transition rounded-full"><BellRingIcon className="w-4 h-4 group-hover:text-white"/></div>
           */}
          {/* <div className="flex items-center">
            <div className="relative ">
              <button
                onClick={toggleDropdown}
                className="relative p-[6px] rounded-full group bg-gray-400 hover:bg-[#377DFF] transition  border flex items-center justify-center"
              >
                <User2 className="w-5 h-5 text-white group-hover:text-white transition"/>
                
              </button>

              <div
              ref={dropdownRef}
                className={`absolute right-0 w-56 mt-2 bg-white border shadow-lg rounded-md ${
                  dropdownVisible
                    ? "transform translate-y-0 opacity-100"
                    : "transform translate-y-4 opacity-0 hidden"
                } transition-all duration-300 ease-out`}
              >
                <div className="p-4">
                  <p className="text-sm font-medium leading-none mb-1">Sahil Kumar</p>
                  <p className="text-xs text-muted-foreground">User Id: 3758390</p>
                </div>
                <div className="border-t">
                  <ul>
                    <li>
                      <Link href="/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                      </Link>
                    </li>
                    <li>
                      <Link href="/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div> */}

