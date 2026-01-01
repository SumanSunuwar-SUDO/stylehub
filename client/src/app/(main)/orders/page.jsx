"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const OrdersHistoryPage = () => {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user orders
  const fetchOrders = async (token) => {
    try {
      const res = await axios.get(`${baseURL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("ORDERS RESPONSE 👉", res.data);

      if (Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);

      // If token expired or invalid
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        router.push("/login");
      } else {
        alert("Failed to load orders");
      }

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // On page load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchOrders(token);
  }, []);

  // Status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await axios.put(
        `${baseURL}/orders/cancel/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order cancelled successfully!");
      fetchOrders(token);
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-16 py-10 flex justify-center items-center min-h-screen">
        <div className="text-2xl">Loading your orders...</div>
      </div>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-16 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">View and track your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-16 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">
            Start shopping to see your orders here
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gray-50 p-6 border-b">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">#{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-semibold text-lg">Rs.{order.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-6 space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-center hover:bg-gray-100 p-4 rounded-xl transition"
                  >
                    <img
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : `${baseURL}/images/${item.image}`
                      }
                      alt={item.productName}
                      className="w-20 h-20 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.productName}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-blue-600">
                        Rs.{item.price} × {item.quantity} = Rs.{item.subTotal}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t">
                  <button
                    onClick={() => router.push(`/orders/${order._id}`)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    View Details
                  </button>

                  {order.orderStatus?.toLowerCase() === "pending" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default OrdersHistoryPage;
