"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { baseURL } from "@/config/env";
import { toast } from "react-toastify";
import Hide from "@/UI/Hide";
import Show from "@/UI/Show";

const Page = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Strong password regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    // Token validation
    if (!token) {
      toast.error("Reset token missing. Please check your email link.");
      setLoading(false);
      return;
    }

    // Empty validation
    if (!password.trim()) {
      toast.error("Password cannot be empty.");
      setLoading(false);
      return;
    }

    // Regex validation
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      );
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/users/reset-password`, {
        token,
        newPassword: password.trim(),
      });

      if (res.data.success) {
        toast.success(
          "Password reset successfully. Please login with your new password.",
        );

        setPassword("");

        // small delay for better UX
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Password reset failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-xl font-bold text-gray-800">Reset Password</h2>

          <p className="text-sm text-gray-600">
            Enter your new secure password below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Password Field */}
          <div className="relative">
            <label className="block mb-1 font-medium text-gray-700">
              New Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-[#F0E8E8] focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />

            {/* Show/Hide */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[33px] cursor-pointer text-gray-600"
            >
              {showPassword ? <Hide /> : <Show />}
            </span>
          </div>

          {/* Password hint */}
          <p className="text-xs text-gray-500">
            Must contain uppercase, lowercase, number, special character, and be
            at least 8 characters long.
          </p>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Page;
