"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${baseURL}/users/forgot-password`, {
        email: email.trim(),
      });

      if (res.data.success) {
        toast.success(
          "Password reset link sent successfully. Please check your email.",
        );
        setEmail("");
      }

      console.log("Reset link sent to:", email);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-8">
        <div className="mb-5 flex flex-col gap-2">
          <h2 className="text-xl font-bold">Forgot Password</h2>
          <p className="text-sm text-gray-600">
            Enter your email and we will send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#F0E8E8] focus:outline-gray-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F0E8E8] hover:bg-blue-500 hover:text-white"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default page;
