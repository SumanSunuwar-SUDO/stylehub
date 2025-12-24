"use client";

import { baseURL } from "@/config/env";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Back from "@/UI/Back";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  // STEP 1: Load cart from localStorage when component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // STEP 2: Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length >= 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // STEP 3: Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  // STEP 4: Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  // STEP 5: Increase quantity by 1 (with stock validation)
  const increaseQuantity = (productId) => {
    const product = cart.find((item) => item._id === productId);
    if (product) {
      // Check if quantity exceeds available stock
      if (product.quantity >= product.in_stuck) {
        alert(`Only ${product.in_stuck} items available in stock!`);
        return;
      }
      updateQuantity(productId, product.quantity + 1);
    }
  };

  // STEP 6: Decrease quantity by 1
  const decreaseQuantity = (productId) => {
    const product = cart.find((item) => item._id === productId);
    if (product) {
      if (product.quantity > 1) {
        updateQuantity(productId, product.quantity - 1);
      }
    }
  };

  // STEP 7: Clear entire cart
  const clearCart = () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  // STEP 8: Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // STEP 9: Calculate total items
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // STEP 10: Navigate to checkout
  const goToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    router.push("/checkout");
  };

  return (
    <main className="max-w-[1400px] mx-auto px-16 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className=" flex text-3xl font-bold">
          <span
            className="py-2 pr-3"
            onClick={() => {
              router.push("/");
            }}
          >
            <Back />
          </span>
          Shopping Cart
        </h1>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Cart Content */}
      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 bg-white p-4 rounded-lg shadow-md"
              >
                {/* Product Image */}
                <div className="w-32 h-32 bg-gray-200 rounded-md shrink-0">
                  <img
                    src={
                      item.image.startsWith("http")
                        ? item.image
                        : `${baseURL}/images/${item.image}`
                    }
                    alt={item.productName}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Product Details */}
                <div className="grow">
                  <h2 className="text-xl font-semibold mb-2">
                    {item.productName}
                  </h2>
                  <p className="text-gray-600 mb-2">Rs. {item.price}</p>
                  <p className="text-sm text-gray-500">
                    Stock: {item.in_stuck}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-xl font-bold">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Items ({getTotalItems()})
                  </span>
                  <span>Rs. {calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Rs. 100.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>Rs. {(calculateTotal() * 0.13).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>
                    Rs.{" "}
                    {(calculateTotal() + 100 + calculateTotal() * 0.13).toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={goToCheckout}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full py-3 mt-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
