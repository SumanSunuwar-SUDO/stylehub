"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const encodedData = query.get("data");

    if (!encodedData) {
      alert("Transaction data missing");
      router.push("/");
      return;
    }

    const safeData = encodeURIComponent(encodedData);

    axios
      .get(`http://localhost:9000/api/orders/esewa/success?data=${safeData}`)
      .then((res) => {
        if (res.data.success && res.data.order) {
          setOrder(res.data.order);

          // Clear cart after successful payment
          localStorage.removeItem("cart");

          // Debug: check items stock
          console.log("Order items after payment:", res.data.order.items);
        } else {
          alert("Payment verification failed");
          router.push("/");
        }
      })
      .catch((err) => {
        console.error("Payment Success Error:", err);
        alert("Something went wrong");
        router.push("/");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Loading...
      </div>
    );

  if (!order)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        Order not found
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-green-600 text-center mb-6">
          Payment Successful
        </h1>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Order ID:</span> {order._id}
          </p>
          <p>
            <span className="font-semibold">Payment Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-white ${
                order.paymentStatus === "completed"
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            >
              {order.paymentStatus}
            </span>
          </p>
          <p>
            <span className="font-semibold">Order Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-white ${
                order.orderStatus === "processing"
                  ? "bg-blue-500"
                  : "bg-gray-500"
              }`}
            >
              {order.orderStatus}
            </span>
          </p>
          <p>
            <span className="font-semibold">Payment Method:</span>{" "}
            {order.paymentMethod}
          </p>
          <p>
            <span className="font-semibold">Transaction ID:</span> {order._id}
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-2">Items:</h3>
        <ul className="divide-y divide-gray-200 mb-4">
          {order.items.map((item, index) => (
            <li
              key={item.product || index}
              className="py-2 flex justify-between text-gray-700"
            >
              <span>
                {item.productName} - {item.quantity} × {item.price}
              </span>
              <span className="font-semibold">{item.subTotal}</span>
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-bold mb-6">
          Total Paid: <span className="text-blue-600">{order.total}</span>
        </h3>

        <button
          onClick={() => router.push("/orders")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
