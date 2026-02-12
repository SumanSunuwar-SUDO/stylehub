"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { baseURL } from "@/config/env";
import { toast } from "react-toastify";
import Hide from "@/UI/Hide";
import Show from "@/UI/Show";

const page = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      toast.error("Reset token missing. Please check your email link.");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter a valid new password.");
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
          "Password reset successfully. You can now log in with your new password.",
        );
        setPassword("");
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-8">
        <div className="mb-4 flex flex-col gap-2">
          <h2 className="text-xl font-bold">Reset Password</h2>
          <p className="text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="relative">
            <label htmlFor="newPassword" className="block mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#F0E8E8] focus:outline-gray-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 cursor-pointer text-sm select-none"
            >
              {showPassword ? <Hide /> : <Show />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F0E8E8] hover:bg-blue-500 hover:text-white"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default page;
