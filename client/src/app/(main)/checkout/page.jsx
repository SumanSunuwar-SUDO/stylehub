"use client";

import Back from "@/UI/Back";
import { useSubmit } from "@/app/hooks/useSubmit";
import { baseURL } from "@/config/env";
import { CartContext } from "@/context/CartContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, setCart, clearCart } = useContext(CartContext);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { loading, handleSubmit: safeSubmit } = useSubmit();

  const [isClient, setIsClient] = useState(false); // client-only flag

  // mark as client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!isClient) return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You must be logged in to checkout!");
      router.push("/login");
    }
  }, [isClient, router]);

  // Load cart / Buy Now items
  useEffect(() => {
    if (!isClient) return;

    const buyNowCart = localStorage.getItem("buyNowCart");
    const normalCart = localStorage.getItem("cart");
    let loadedCart = [];

    if (buyNowCart) {
      try {
        loadedCart = JSON.parse(buyNowCart);
      } catch (e) {
        console.error("Failed to parse buyNowCart:", e);
        loadedCart = normalCart ? JSON.parse(normalCart) : [];
      }
    } else {
      loadedCart = normalCart ? JSON.parse(normalCart) : [];
    }

    // Remove duplicates and filter out 0 quantity
    const uniqueCart = Array.from(
      new Map(
        loadedCart
          .filter((item) => item.quantity > 0)
          .map((item) => [`${item._id}-${item.size || "N/A"}`, item])
      ).values()
    );

    setCart(uniqueCart);
  }, [isClient, setCart]);

  if (!isClient) return null; // prevent hydration error

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingCost = 100;
  const grandTotal = subtotal + shippingCost;

  const handleSubmitSafe = (e) => {
    e.preventDefault();

    safeSubmit(async () => {
      if (cart.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You are not logged in!");
        router.push("/login");
        return;
      }

      const orderData = {
        fullName,
        email,
        phone,
        address,
        paymentMethod,
        subTotal: Number(subtotal.toFixed(2)),
        total: Number(grandTotal.toFixed(2)),
        items: cart.map((item) => ({
          _id: item._id,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: item.size || "N/A",
        })),
      };

      const submitEsewaForm = (paymentData) => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        Object.entries(paymentData).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      };

      try {
        if (paymentMethod === "cod") {
          const { data } = await axios.post(
            `${baseURL}/orders/create`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (data.success) {
            clearCart();
            toast.success(
              "Order placed successfully! Confirmation email has been sent."
            );
            router.push(`/orders/${data.orderId}`);
          }
        }

        if (paymentMethod === "esewa") {
          const { data } = await axios.post(
            `${baseURL}/orders/esewa/initiate`,
            orderData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (data.success && data.paymentData) {
            submitEsewaForm(data.paymentData);
          } else {
            toast.error(data.message || "Failed to initiate eSewa payment");
          }
        }
      } catch (error) {
        console.error("Checkout error:", error);
        toast.error(error.response?.data?.message || "Failed to place order");
      }
    });
  };

  return (
    <main className="max-w-[1400px] mx-auto px-16 py-10">
      <div className="flex items-center gap-3 text-[30px] font-bold mb-8">
        <span
          className="py-2 pr-3 cursor-pointer"
          onClick={() => router.back() || router.push("/")}
        >
          <Back />
        </span>
        <h1>Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Shipping Info */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
          <form onSubmit={handleSubmitSafe} className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              pattern="[0-9]{10}"
              className="w-full px-4 py-3 border rounded-lg"
            />

            <div className="border-t pt-4">
              <h3 className="text-xl font-bold mb-2">Payment Method</h3>

              <label className="flex items-center gap-3 border px-4 py-3 rounded-lg mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="esewa"
                  checked={paymentMethod === "esewa"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <img src="/images/esewa.png" alt="eSewa" className="w-8 h-8" />
                <span>Pay via eSewa</span>
              </label>

              <label className="flex items-center gap-3 border px-4 py-3 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash On Delivery</span>
              </label>
            </div>

            <button
              type="submit"
              className={`w-full py-4 rounded-lg font-bold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-lg shadow-md sticky top-4">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
            {cart.map((item, index) => (
              <div key={`${item._id}-${index}`} className="flex gap-3">
                <img
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `${baseURL}/images/${item.image}`
                  }
                  className="w-20 h-20 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-sm">
                    Qty: {item.quantity} × Rs.{item.price}
                  </p>
                  <p className="text-sm">Size: {item.size || "N/A"}</p>
                </div>
                <p className="font-bold">Rs.{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rs.{shippingCost}</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t pt-2">
              <span>Total</span>
              <span>Rs.{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
