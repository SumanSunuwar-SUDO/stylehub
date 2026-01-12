"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Register = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!firstName || !lastName || !email || !password || !address) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const result = await axios.post(`${baseURL}/users/create`, {
        firstName,
        lastName,
        email,
        password,
        address,
      });

      if (result.data.success) {
        toast.success(
          "Registration successful! Please check your email to verify."
        );

        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setAddress("");

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      console.log("Axios error response:", error.response?.data);

      // Show backend error if available
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0E8E8]">
      <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">User Register</h1>
        <p className="text-center text-gray-500 mb-6">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#F0E8E8] focus:outline-gray-500"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#F0E8E8] focus:outline-gray-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#F0E8E8] focus:outline-gray-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#F0E8E8] focus:outline-gray-500"
          />
          <input
            type="text"
            placeholder="Address (e.g., Kathmandu)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-black font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
