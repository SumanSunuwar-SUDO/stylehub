"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${baseURL}/users/login`, {
        email,
        password,
      });

      // console.log(result.data);

      // Save token
      localStorage.setItem("accessToken", result.data.token);

      // Save user data with firstName
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: result.data.data.firstName,
          email: result.data.data.email,
        })
      );

      setEmail("");
      setPassword("");
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0E8E8]">
      <div className="w-full max-w-[600px] bg-[#ffffff] rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">User Login</h1>
        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-black bg-[#F0E8E8]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg focus:outline-none bg-[#F0E8E8]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#F0E8E8] text-black py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-black font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
