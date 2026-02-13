"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#00C49F",
  "#FF6384",
  "#36A2EB",
];

const CategoryPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCategorySales = async () => {
      try {
        const res = await axios.get(`${baseURL}/dashboard/category-sales`);

        // ensure correct format and avoid undefined
        const formattedData = res?.data?.data?.map((item) => ({
          name: item.name || "Unknown",
          value: item.value || 0,
        }));

        setData(formattedData || []);
      } catch (error) {
        console.log("Category sales error:", error);
      }
    };

    fetchCategorySales();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip
          formatter={(value) => `Rs ${Number(value).toLocaleString()}`}
        />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
