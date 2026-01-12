"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentFailurePage = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState(null);

  // Optional: get orderId from query string
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get("orderId");
    if (id) setOrderId(id);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-700 mb-4">
          Unfortunately, your payment could not be processed.
        </p>

        {orderId && (
          <p className="text-gray-600 mb-4">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
        )}

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => router.push("/checkout")}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Retry Payment
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
