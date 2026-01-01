"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const OrderConfirmationPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("You must be logged in to view this order");
          router.push("/login");
          return;
        }

        const { data } = await axios.get(`${baseURL}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (data.success) {
          setOrder(data.order);
        } else {
          alert("Failed to load order details");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        alert(error.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-16 py-10 flex justify-center items-center min-h-screen">
        <div className="text-2xl">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-[1400px] mx-auto px-16 py-10 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-16 py-10">
      {/* Success Message */}
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 mb-8 text-center">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been received.
        </p>
        <p className="text-sm text-gray-500 mt-2">Order ID: #{order._id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Order Details</h2>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {order.items?.map((item, index) => (
              <div key={index} className="flex gap-4 border-b pb-4">
                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `${baseURL}/images/${item.image}`
                  }
                  alt={item.productName}
                  className="w-24 h-24 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.productName}</h3>
                  <p className="text-gray-600">Size: {item.size || "N/A"}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="font-bold text-blue-600">Rs.{item.price}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
                    Rs.{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>Rs.{order.subTotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Rs.{(order.total - order.subTotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t pt-2">
              <span>Total</span>
              <span>Rs.{order.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Shipping Information</h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-semibold">Name:</span> {order.fullName}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {order.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {order.phone}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {order.address}
              </p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Payment Information</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold">Method:</span>{" "}
                {order.paymentMethod === "cod" ? "Cash on Delivery" : "eSewa"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Payment Status:</span>{" "}
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  {order.paymentStatus || "Pending"}
                </span>
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Order Status:</span>{" "}
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {order.orderStatus || "Pending"}
                </span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/orders")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              View All Orders
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmationPage;
