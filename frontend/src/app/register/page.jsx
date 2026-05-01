"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();
    // Implement registration logic here
    console.log("Registration attempt", { userType, name, email, password, confirmPassword });
    // For now, just redirect to login page
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[26rem] text-sm">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <p className="text-gray-500 mb-6">Create a new account</p>
        <form onSubmit={handleRegister}>
          <div className="space-y-4">
            {/* User Type Dropdown */}
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700">User Type</label>
              <select
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full border-gray-300 border rounded-md p-2 mt-1"
              >
                <option value="admin">Admin</option>
                <option value="schoolAdmin">Local Admin</option>
                <option value="staff">Normal User</option>
              </select>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-gray-300 border rounded-md p-2 mt-1"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-gray-300 border rounded-md p-2 mt-1"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                type="tel"  // 'tel' type is best for phone numbers
                value={phoneNumber}  // Use a state variable to bind the value
                onChange={(e) => setPhoneNumber(e.target.value)}  // Update state on change
                className="w-full border-gray-300 border rounded-md p-2 mt-1"
                placeholder="Enter your phone number"  // Optional placeholder text
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-gray-300 border rounded-md p-2 mt-1"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-gray-300 border rounded-md p-2 mt-1"
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={handleRegister}
            className="w-full mt-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
