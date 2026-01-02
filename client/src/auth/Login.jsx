"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext"; // <-- import AuthContext

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useContext(AuthContext); // <-- get login function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${baseURL}/users/login`, {
        email,
        password,
      });

      const userData = {
        name: result.data.data.firstName,
        email: result.data.data.email,
        role: result.data.data.role,
      };
      const token = result.data.token;

      // Call AuthContext login instead of writing to localStorage directly
      login(userData, token);

      setEmail("");
      setPassword("");

      if (userData.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
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
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg focus:outline-gray-500 bg-[#F0E8E8]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg focus:outline-gray-500 bg-[#F0E8E8]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F0E8E8] text-black py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
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
