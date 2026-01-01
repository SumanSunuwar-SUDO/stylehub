"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return router.push("/login");

      const res = await axios.get(`${baseURL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data.order);
      console.log(res.data.order.items);

      setOrder(res.data.order);
      setOrderItems(res.data.order.items);
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
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>

          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 border-b py-4 items-center"
            >
              <h1>{order.name}</h1>
              <img
                src={
                  item.image?.startsWith("http")
                    ? item.image
                    : `${baseURL}/images/${item.image}`
                }
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />

              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p>Rs. {item.price}</p>
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
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rs. {order.total}</span>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT SIDE ---------------- */}
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

          {/* Status Controls */}
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold">Update Status</h3>

            {/* Order Status */}
            <div>
              <p className="font-semibold mb-2">Order Status</p>
              <div className="flex gap-2 flex-wrap">
                {["processing", "shipped", "delivered", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      disabled={updating}
                      onClick={() => updateOrderStatus(status)}
                      className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Payment Status */}
            <div>
              <p className="font-semibold mb-2">Payment Status</p>
              <div className="flex gap-2">
                {["pending", "completed", "failed"].map((status) => (
                  <button
                    key={status}
                    disabled={updating}
                    onClick={() => updatePaymentStatus(status)}
                    className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 disabled:opacity-50"
                  >
                    {status}
                  </button>
                ))}
              </div>
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

export default page;
