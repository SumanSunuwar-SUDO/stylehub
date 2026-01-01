"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return router.push("/login");

        // Fetch single order by ID
        const res = await axios.get(`${baseURL}/orders/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(res.data.result || null);
      } catch (err) {
        console.log("Error fetching order:", err.response?.data || err.message);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, [params.id, router]);

  if (loading) return <div className="p-5">Loading...</div>;
  if (!order) return <div className="p-5">Order not found</div>;

  return (
    <main className="min-h-screen max-w-[900px] mx-auto bg-[#F0E8E8] p-5">
      <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back
      </button>

      <h1 className="text-2xl font-semibold mb-4">Order Details</h1>

      <div className="bg-white rounded-md shadow p-5 mb-6">
        <h2 className="font-semibold text-lg mb-2">Customer Info</h2>
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

      <div className="bg-white rounded-md shadow p-5 mb-6">
        <h2 className="font-semibold text-lg mb-2">Order Info</h2>
        <p>
          <strong>Order ID:</strong> #{order._id.slice(-6)}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded ${
              order.orderStatus === "delivered"
                ? "bg-green-100 text-green-700"
                : order.orderStatus === "processing"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {order.paymentMethod === "esewa" ? "delivered" : order.orderStatus}
          </span>
        </p>
        <p>
          <strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus}
          )
        </p>
        <p>
          <strong>Total:</strong> Rs. {order.total}
        </p>
      </div>

      <div className="bg-white rounded-md shadow p-5">
        <h2 className="font-semibold text-lg mb-2">Items</h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-4 py-2">S.N.</th>
              <th className="text-left px-4 py-2">Product</th>
              <th className="text-left px-4 py-2">Quantity</th>
              <th className="text-left px-4 py-2">Price</th>
              <th className="text-left px-4 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={item._id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">Rs. {item.price}</td>
                <td className="px-4 py-2">Rs. {item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Page;
