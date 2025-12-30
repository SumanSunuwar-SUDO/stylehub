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

      {/* Recent Orders */}
      <div className="mt-8 px-5">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold">Recent Orders</h1>
          <div className="flex items-center relative">
            <input
              type="text"
              placeholder="Search by customer name..."
              className="h-[35px] text-sm px-4 pr-10 rounded-md border bg-[#ffffff] border-gray-300 outline-none"
            />
            <button className="absolute right-2 text-gray-500 hover:text-black">
              <Search />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b">Order ID</th>
                <th className="px-4 py-2 border-b">Customer Name</th>
                <th className="px-4 py-2 border-b">Order Date</th>
                <th className="px-4 py-2 border-b">Total</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Payment Status</th>
                <th className="px-4 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border-b">#001</td>
                <td className="px-4 py-2 border-b">John Doe</td>
                <td className="px-4 py-2 border-b">2025-12-30</td>
                <td className="px-4 py-2 border-b">NRP.5000</td>
                <td className="px-4 py-2 border-b">Completed</td>
                <td className="px-4 py-2 border-b">Paid</td>
                <td className="px-4 py-2 border-b">View</td>
              </tr>
              {/* Add more rows dynamically */}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default page;
