"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AreaChart from "../components/AreaChart";
import CategoryPieChart from "../components/PieChart";
import {
  TrendingUpDown,
  ShoppingCartIcon,
  CreditCardIcon,
  Users2,
} from "lucide-react";
import TrendingUp from "@/UI/TrendingUp";
const statsCards = [
  {
    title: "Total Sales",
    key: "totalSales",
    icon: <TrendingUp className="text-green-700" />,
  },
  {
    title: "Total Orders",
    key: "totalOrders",
    icon: <ShoppingCartIcon />,
  },
  {
    title: "Pending Payments",
    key: "pendingPayments",
    icon: <CreditCardIcon />,
  },
  {
    title: "Total Customers",
    key: "totalCustomers",
    icon: <Users2 />,
  },
];

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingPayments: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await axios.get(`${baseURL}/dashboard/stats`);
        setStats(response.data.data);
      } catch (error) {
        console.error("Dashboard stats error:", error);
        toast.error("Failed to load dashboard stats");
      }
    };

    getStats();
  }, []);

  return (
    <main className="min-h-screen max-w-[1400px] mx-auto bg-[#F0E8E8]">
      {/* Header */}
      <header className="h-[65px] bg-white w-full flex justify-between items-center border-b px-5">
        <h2 className="text-xl font-semibold text-[#E67514]">Dashboard</h2>
      </header>

      {/* Stats Cards */}
      <section className="flex flex-wrap gap-4 mt-5 px-5">
        {statsCards.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-md px-6 py-4 flex  items-start justify-start gap-3 shadow-sm"
          >
            <span className=" p-2 rounded-md bg-gray-100 text-sm text-green-700">
              {card.icon}
            </span>
            <h1 className="flex flex-col items-start  justify-center">
              <span>{card.title}</span>
              <span className="text-lg font-bold">
                {card.key === "totalSales"
                  ? `NRP.${stats[card.key]}`
                  : stats[card.key]}
              </span>
            </h1>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="flex flex-wrap justify-around items-center px-5 mt-6 gap-6">
        <div className="h-[450px] w-[600px] bg-white rounded-md p-4 flex flex-col items-center justify-center">
          <AreaChart />
          <p className="text-center mt-2">Monthly Sales Overview</p>
        </div>
        <div className="h-[450px] w-[600px] bg-white rounded-md p-4 flex flex-col items-center justify-center">
          <CategoryPieChart />
          <p className="mt-2">Sales by Category</p>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
