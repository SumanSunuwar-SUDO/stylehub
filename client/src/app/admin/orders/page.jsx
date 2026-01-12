"use client";

import { baseURL } from "@/config/env";
import Search from "@/UI/Search";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState({});
  const router = useRouter();

  // Fetch all orders
  useEffect(() => {
    const getOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get(`${baseURL}/orders/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedOrders = (res.data.result || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response?.data || error.message
        );
        toast.error("Failed to fetch orders!");
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  // Handle search input
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return setFilteredOrders(orders);

    const filtered = orders.filter(
      (o) =>
        o.fullName.toLowerCase().includes(term) ||
        o.email.toLowerCase().includes(term) ||
        o._id.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Handle status change for COD orders
  const handleStatusChange = async (order) => {
    const newStatus = order.tempStatus || order.orderStatus;
    setSavingStatus((prev) => ({ ...prev, [order._id]: true }));

    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.put(
        `${baseURL}/orders/status/${order._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id
            ? { ...res.data.order, isEditing: false, tempStatus: undefined }
            : o
        )
      );
      setFilteredOrders((prev) =>
        prev.map((o) =>
          o._id === order._id
            ? { ...res.data.order, isEditing: false, tempStatus: undefined }
            : o
        )
      );

      toast.success("Order status updated!");
    } catch (err) {
      console.error(
        "Error updating status:",
        err.response?.data?.message || err.message
      );
      toast.error(
        err.response?.data?.message || "Failed to update order status!"
      );
    } finally {
      setSavingStatus((prev) => ({ ...prev, [order._id]: false }));
    }
  };

  return (
    <main className="min-h-screen max-w-[1400px] mx-auto bg-[#F0E8E8]">
      {/* Header */}
      <div className="h-[65px] bg-[#E67514] w-full flex justify-between items-center border-b px-5">
        <h2 className="text-xl font-semibold text-white">Orders</h2>
      </div>

      {/* Search Bar */}
      <div className="mt-8 px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold">All Orders</h1>

        <div className="flex items-center relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by customer name, email, or order ID..."
            className="h-[35px] text-sm px-4 pr-10 rounded-md border bg-white border-gray-300 outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" className="absolute right-2 text-gray-500">
            <Search />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-md shadow mt-4">
        <table className="w-full text-sm min-w-[900px]">
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
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => {
                const createdAt = new Date(order.createdAt);
                const formattedDate = createdAt.toLocaleDateString("en-US");
                const formattedTime = createdAt.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                // Status badge colors
                const statusClasses =
                  order.orderStatus === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order.orderStatus === "processing"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700";

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
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded ${statusClasses}`}
                      >
                        {order.paymentMethod === "esewa"
                          ? "delivered"
                          : order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {formattedDate} {formattedTime}
                    </td>

                    <td className="px-4 py-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() =>
                          router.push(`/admin/orders/${order._id}`)
                        }
                        className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        View
                      </button>

                      {order.paymentMethod === "cod" &&
                        !["delivered", "cancelled"].includes(
                          order.orderStatus
                        ) &&
                        (order.isEditing ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={order.tempStatus || order.orderStatus}
                              onChange={(e) =>
                                setOrders((prev) =>
                                  prev.map((o) =>
                                    o._id === order._id
                                      ? { ...o, tempStatus: e.target.value }
                                      : o
                                  )
                                )
                              }
                              className="border rounded px-2 py-1 text-sm"
                              disabled={savingStatus[order._id]}
                            >
                              <option value="processing">Processing</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            <button
                              onClick={() => handleStatusChange(order)}
                              disabled={savingStatus[order._id]}
                              className={`px-2 py-1 text-sm text-white rounded ${
                                savingStatus[order._id]
                                  ? "bg-gray-400"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                            >
                              {savingStatus[order._id] ? "Saving..." : "Save"}
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
    </main>
  );
};

export default Page;
