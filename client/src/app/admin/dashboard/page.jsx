"use client";

import { baseURL } from "@/config/env";
import Search from "@/UI/Search";
import axios from "axios";
import React, { useEffect, useState } from "react";

const page = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendignPayments: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await axios.get(`${baseURL}/dashboard/stats`);
        console.log(response.data.data);
        setStats(response.data.data);
      } catch (error) {
        console.log("Dashboard stats error", error);
      }
    };

    getStats();
  }, []);
  return (
    <main className="min-h-screen max-w-[1400px] mx-auto bg-[#F0E8E8]">
      {/* Header */}
      <div className="h-[65px] bg-[#E67514] w-full flex justify-between items-center border-b  px-5">
        <h2 className="text-xl font-semibold text-white">Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 mt-5  px-5">
        <div className="bg-white rounded-md px-6 py-4 flex-1 min-w-[200px]">
          <h2 className="text-xl font-medium mb-2">Total Sales</h2>
          <h1 className="text-xl font-bold">NRP.{stats.totalSales}</h1>
        </div>
        <div className="bg-white rounded-md px-6 py-4 flex-1 min-w-[200px]">
          <h2 className="text-xl font-medium mb-2">Total Orders</h2>
          <h1 className="text-xl font-bold">{stats.totalOrders}</h1>
        </div>
        <div className="bg-white rounded-md px-6 py-4 flex-1 min-w-[200px]">
          <h2 className="text-xl font-medium mb-2">Pending Payments</h2>
          <h1 className="text-xl font-bold">{stats.pendignPayments}</h1>
        </div>
        <div className="bg-white rounded-md px-6 py-4 flex-1 min-w-[200px]">
          <h2 className="text-xl font-medium mb-2">Total Customers</h2>
          <h1 className="text-xl font-bold">{stats.totalCustomers}</h1>
        </div>
      </div>
    </main>
  );
};

export default page;
