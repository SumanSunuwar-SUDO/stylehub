"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await axios.get(`${baseURL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(res.data.order);
      setOrderItems(res.data.order.items || []);
    } catch (err) {
      console.log("Fetch order error:", err.response?.data || err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found
      </div>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto bg-[#F0E8E8] min-h-screen">
      {/* Header */}
      <div className="h-[65px] bg-[#E67514] flex items-center px-5">
        <h2 className="text-xl font-semibold text-white">Order Details</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-5">
        {/* ---------------- LEFT ---------------- */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>

          {orderItems.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 py-4 items-center hover:bg-gray-200 px-5 rounded-xl transition-all duration-300"
            >
              <img
                src={
                  item.image?.startsWith("http")
                    ? item.image
                    : `${baseURL}/images/${item.image}`
                }
                alt={item.productName}
                className="w-20 h-20 object-cover rounded"
              />

              <div className="flex-1">
                <p className="font-semibold">{item.productName}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm text-gray-600">Size: {item.size}</p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  Rs. {item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="mt-6 space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {order.subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rs. {order.total - order.subTotal}</span>
            </div>
            <div className="flex justify-between border-t mt-3 pt-3 font-bold text-lg">
              <span>Total</span>
              <span>Rs. {order.total}</span>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT ---------------- */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Shipment Info</h3>
            <p>
              <strong>Name:</strong> {order.fullName}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Phone:</strong> {order.phone}
            </p>
            <p>
              <strong>Address:</strong> {order.address}
            </p>
          </div>

          {/*  Order Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-xl font-semibold mb-3">Order Status</h1>

            {/* Payment Status */}
            <div className="flex justify-between items-center mb-3">
              <h1 className="font-semibold">Payment Status</h1>
              <span className="text-gray-700 font-medium">
                {order.paymentMethod === "cod" &&
                order.orderStatus === "delivered"
                  ? "Completed"
                  : order.paymentStatus === "completed"
                  ? "Completed"
                  : order.paymentStatus === "pending"
                  ? "Pending"
                  : order.paymentStatus === "failed"
                  ? "Failed"
                  : "-"}
              </span>
            </div>

            {/* Shipping Status */}
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Shipping Status</h1>

              {order.paymentMethod === "cod" &&
              ["delivered", "cancelled"].includes(order.orderStatus) ? (
                // If delivered/cancelled → show text only
                <span className="text-gray-700 font-medium">
                  {order.orderStatus}
                </span>
              ) : (
                // Editable dropdown for COD orders that are not delivered/cancelled
                <div className="flex items-center gap-2">
                  <select
                    value={order.tempStatus || order.orderStatus} // tempStatus for local selection
                    onChange={(e) =>
                      setOrder((prev) => ({
                        ...prev,
                        tempStatus: e.target.value,
                      }))
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
                        setUpdating(true);
                        const token = localStorage.getItem("accessToken");
                        const newStatus = order.tempStatus || order.orderStatus;

                        const res = await axios.put(
                          `${baseURL}/orders/status/${order._id}`,
                          { status: newStatus },
                          {
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );

                        setOrder({
                          ...res.data.order,
                          tempStatus: undefined,
                        });

                        setUpdating(false);
                      } catch (err) {
                        console.log(err.response?.data?.message || err.message);
                        setUpdating(false);
                        alert(err.response?.data?.message || "Update failed");
                      }
                    }}
                    className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    disabled={updating}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-200 py-3 rounded-lg hover:bg-gray-300"
          >
            Back to Orders
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;
