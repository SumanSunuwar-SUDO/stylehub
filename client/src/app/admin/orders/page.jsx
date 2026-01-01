"use client";

import { baseURL } from "@/config/env";
import Search from "@/UI/Search";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get(`${baseURL}/orders/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Sort orders by newest first
        const sortedOrders = (res.data.result || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedOrders);
      } catch (error) {
        console.log(
          "Error fetching orders:",
          error.response?.data || error.message
        );
      }
    };

    getOrders();
  }, []);

  return (
    <main className="min-h-screen max-w-[1400px] mx-auto bg-[#F0E8E8]">
      {/* Header */}
      <div className="h-[65px] bg-[#E67514] w-full flex justify-between items-center border-b px-5">
        <h2 className="text-xl font-semibold text-white">Orders</h2>
      </div>

      {/* Order List */}
      <div className="mt-8 px-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">All Orders</h1>

          <div className="flex items-center relative">
            <input
              type="text"
              placeholder="Search by customer name..."
              className="h-[35px] text-sm px-4 pr-10 rounded-md border bg-white border-gray-300 outline-none"
            />
            <button className="absolute right-2 text-gray-500">
              <Search />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-md shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left px-4 py-3">S.N.</th>
                <th className="text-left px-4 py-3">Order ID</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Payment</th>
                <th className="text-left px-4 py-3">Order Status</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  const createdAt = new Date(order.createdAt);
                  const formattedDate = createdAt.toLocaleDateString("en-US");
                  const formattedTime = createdAt.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-100 transition-colors duration-300"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-medium">
                        #{order._id.slice(-6)}
                      </td>
                      <td className="px-4 py-3">{order.fullName}</td>
                      <td className="px-4 py-3">{order.email}</td>
                      <td className="px-4 py-3">Rs. {order.total}</td>
                      <td className="px-4 py-3 capitalize">
                        {order.paymentMethod} ({order.paymentStatus})
                      </td>
                      <td className="px-4 py-3 capitalize">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            order.orderStatus === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.orderStatus === "processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.paymentMethod === "esewa"
                            ? "delivered"
                            : order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {formattedDate} {formattedTime}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 flex gap-2">
                        {/* View Button */}
                        <button
                          onClick={() =>
                            router.push(`/admin/orders/${order._id}`)
                          }
                          className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          View
                        </button>

                        {/* Change Status Button */}
                        {order.paymentMethod !== "esewa" &&
                          (order.isEditing ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={order.orderStatus}
                                onChange={(e) =>
                                  setOrders((prev) =>
                                    prev.map((o) =>
                                      o._id === order._id
                                        ? { ...o, orderStatus: e.target.value }
                                        : o
                                    )
                                  )
                                }
                                className="border rounded px-2 py-1 text-sm"
                              >
                                <option value="processing">Processing</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <button
                                onClick={async () => {
                                  try {
                                    const token =
                                      localStorage.getItem("accessToken");
                                    await axios.put(
                                      `${baseURL}/orders/status/${order._id}`,
                                      { status: order.orderStatus },
                                      {
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    );
                                    setOrders((prev) =>
                                      prev.map((o) =>
                                        o._id === order._id
                                          ? { ...o, isEditing: false }
                                          : o
                                      )
                                    );
                                  } catch (err) {
                                    console.log(
                                      "Error updating status:",
                                      err.response?.data || err.message
                                    );
                                  }
                                }}
                                className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                setOrders((prev) =>
                                  prev.map((o) =>
                                    o._id === order._id
                                      ? { ...o, isEditing: true }
                                      : o
                                  )
                                )
                              }
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Change
                            </button>
                          ))}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Page;
