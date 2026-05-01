"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/update-password`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // On success, redirect to dashboard
      router.push("/home/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Update Password</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password:
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 mb-4 w-full border border-gray-300 p-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
