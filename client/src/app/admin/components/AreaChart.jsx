"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const AreaChart = () => {
  const [data, setData] = useState([]);

  // Month names array
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const res = await axios.get(`${baseURL}/dashboard/monthly-sales`);

        const formattedData = res.data.data.map((item) => ({
          name: monthNames[item._id - 1],
          Sales: item.totalSales,
        }));

        setData(formattedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMonthlySales();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `Rs ${value.toLocaleString()}`} />
        <Tooltip formatter={(value) => `Rs ${value.toLocaleString()}`} />

        <Area
          type="monotone"
          dataKey="Sales"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorSales)"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart;
