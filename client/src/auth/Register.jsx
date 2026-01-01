"use client";
import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useState } from "react";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await axios.post(`${baseURL}/users/create`, {
      email: email,
      firstName,
      lastName,
      password,
      address,
    });
    console.log(result);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setAddress("");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0E8E8]">
      <div className="w-full max-w-[600] bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">User Register</h1>
        <p className="text-center text-gray-500 mb-6">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-2  rounded-lg focus:outline-gray-500 bg-[#F0E8E8]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-2  rounded-lg  focus:outline-gray-500 bg-[#F0E8E8]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2  rounded-lg  focus:outline-gray-500 bg-[#F0E8E8]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2  rounded-lg  focus:outline-gray-500 bg-[#F0E8E8]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              placeholder="e.g Kathmandu"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-4 py-2  rounded-lg  focus:outline-gray-500 bg-[#F0E8E8]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F0E8E8] text-black py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Register
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
