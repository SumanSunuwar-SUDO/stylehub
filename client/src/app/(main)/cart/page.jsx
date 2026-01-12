"use client";

import { baseURL } from "@/config/env";
import React, { useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import Back from "@/UI/Back";
import { CartContext } from "@/context/CartContext";
import { toast } from "react-toastify";
import { useSubmit } from "@/app/hooks/useSubmit";

const CartPage = () => {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalItems } =
    useContext(CartContext);
  const { loading, handleSubmit: safeSubmit } = useSubmit();

  // Increase quantity
  const increaseQuantity = (productId, size) => {
    const product = cart.find(
      (item) => item._id === productId && item.size === size
    );
    if (!product) return;

    if (product.quantity >= product.in_stock) {
      toast.warning(`Only ${product.in_stock} items available in stock!`);
      return;
    }
    updateQuantity(productId, product.quantity + 1, size);
  };

  // Decrease quantity
  const decreaseQuantity = (productId, size) => {
    const product = cart.find(
      (item) => item._id === productId && item.size === size
    );
    if (product && product.quantity > 1) {
      updateQuantity(productId, product.quantity - 1, size);
    }
  };

  // Remove item
  const handleRemove = (productId, size) => {
    removeFromCart(productId, size);
    toast.success("Item removed from cart!");
  };

  // Calculate total
  const calculateTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  // Checkout safely
  const goToCheckoutSafe = () => {
    safeSubmit(async () => {
      if (cart.length === 0) {
        toast.error("Your cart is empty!");
        return;
      }

      localStorage.removeItem("buyNowCart");
      router.push("/checkout");
    });
  };

  // Clear cart safely
  const handleClearCartSafe = () => {
    safeSubmit(async () => {
      if (window.confirm("Are you sure you want to clear your cart?")) {
        clearCart();
        toast.success("Cart cleared successfully!");
      }
    });
  };

  return (
    <main className="max-w-[1400px] min-h-screen mx-auto px-16 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="flex text-3xl font-bold">
          <span
            className="py-2 pr-3 cursor-pointer"
            onClick={() => router.back() || router.push("/")}
          >
            <Back />
          </span>
          Shopping Cart
        </h1>
        {cart.length > 0 && (
          <button
            onClick={handleClearCartSafe}
            disabled={loading}
            className={`px-4 py-2 rounded-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            {loading ? "Processing..." : "Clear Cart"}
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item._id}-${item.size}`}
                className="flex gap-4 bg-white p-4 rounded-lg shadow-md cursor-pointer"
                onClick={() => router.push(`/products/${item._id}`)}
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

                {/* Product Info */}
                <div className="grow">
                  <h2 className="text-xl font-semibold mb-2">
                    {item.productName}
                  </h2>
                  <p className="text-gray-600 mb-2">Size: {item.size}</p>
                  <p className="text-gray-600 mb-2">Rs. {item.price}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          decreaseQuantity(item._id, item.size);
                        }}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseQuantity(item._id, item.size);
                        }}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item._id, item.size);
                      }}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item total */}
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
                  <span>Rs. {calculateTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>Rs. {calculateTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={goToCheckoutSafe}
                disabled={loading}
                className={`w-full py-3 font-semibold rounded-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>

              <button
                onClick={() => router.push("/products")}
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
