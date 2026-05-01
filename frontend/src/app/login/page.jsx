"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { loginUser as loginUserService } from "@/api/authService";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [userType, setUserType] = useState("CEO");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser, setUserRole } = useUser();

  const mutation = useMutation({
    mutationFn: (credentials) => loginUserService(credentials),
    onSuccess: (data) => {
      console.log("Login Success", data);
      localStorage.setItem("token", data.token);

      const userDetails = {
        userId: data.userId,
        role: data.role,
        schoolId: data.schoolId || null,
        employeeId: data.employeeId || null,
        zoneId: data.zoneId || null,
        districtId: data.districtId || null,
        officeId: data.officeId || null,
      };
      localStorage.setItem("user", JSON.stringify(userDetails));

      
      setUser(userDetails);
      setUserRole(data.role);

      if (data.forcePasswordChange) {
        router.push("/update-password");
      } else {
        router.push("/home/dashboard");
      }
    },
    onError: (err) => {
      const errorMessage =
        err?.response?.data?.message || 
        err?.message ||                 
        "Login failed. Please try again.";
        
      setError(errorMessage);
    },
    
  });
  

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate({ userName: userId, password, loginAs: userType });
  };
 
  return (
    <div className="min-h-screen flex relative flex-col md:flex-row">
      
      {/* Left Section */}
      <div className="hidden md:flex flex-1 shadow-xl  text-[#377dff] flex-col justify-center items-center p-8">
      <Image src="/logo.svg" alt="Logo" width={100} height={100} className="w-[30rem] h-[30rem]"/>
        <p className="absolute bottom-5 font-medium text-gray-700 text-[13px] opacity-75">© 2025 CEO Doda. All rights reserved.</p>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 bg-gradient-to-br   from-[#377dff] to-[#4d86f0] flex items-center justify-center p-6">
        <div className="bg-white  p-8 rounded-lg shadow-lg w-[26rem]">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back!</h2>
          <p className="text-gray-500 mb-6 text-sm">
          Enter your credentials to access your account
          </p>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="space-y-4 text-sm">
              {/* User Type Dropdown */}
              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                  User Type
                </label>
                <select
                  id="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full border-gray-300 border rounded-md p-2 mt-1"
                >
                  <option value="CEO">CEO</option>
                  <option value="ZEO">ZEO</option>
                  <option value="schoolAdmin">School Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              {/* User ID */}
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full border-gray-300 border rounded-md p-2 mt-1"
                  required
                />
              </div>

              {/* Password with Show/Hide Button */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-gray-300 border rounded-md p-2 mt-1 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full mt-6 py-2 bg-blue-500 transition text-white font-semibold rounded-md hover:bg-blue-700"
            >
              {mutation.isLoading ? "Logging in..." : "Login Now"}
            </button>

          </form>

          {/* Forgot Password */}
          {/* <div className="mt-4 text-sm text-center">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password? Click here
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}
