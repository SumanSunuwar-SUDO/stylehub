"use client";

import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "@/config/env";
import { toast } from "react-toastify";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${baseURL}/users/resend-verification`, {
        email: email.trim(),
      });

      if (res.data.success) {
        toast.success(res.data.message || "Verification email sent!");
        setEmail("");
      }
    } catch (error) {
      console.error("Resend verification error:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0E8E8]">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Resend Verification Email
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email to receive a new verification link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#F0E8E8] focus:outline-gray-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F0E8E8] hover:bg-blue-500 hover:text-white"
            }`}
          >
            {loading ? "Sending..." : "Resend Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResendVerification;
