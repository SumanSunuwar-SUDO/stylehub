"use client";

import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Lazy load cart from localStorage
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  // Persist or remove cart on change
  useEffect(() => {
    if (cart.length === 0) {
      localStorage.removeItem("cart");
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Add to Cart
  const addToCart = (product, quantity = 1) => {
    let added = false;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item._id === product._id && item.size === product.size
      );

      if (existingItem) {
        if (existingItem.quantity + quantity > existingItem.in_stuck) {
          toast.error(
            `Cannot add more than ${existingItem.in_stuck} items for this size!`
          );
          return prevCart;
        }
        added = true;
        return prevCart.map((item) =>
          item._id === product._id && item.size === product.size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        if (quantity > product.in_stuck) {
          toast.error(
            `Cannot add more than ${product.in_stuck} items for this size!`
          );
          return prevCart;
        }
        added = true;
        return [...prevCart, { ...product, quantity }];
      }
    });

    return added;
  };

  // Update quantity
  const updateQuantity = (productId, quantity, size) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId && item.size === size
          ? quantity > item.in_stuck
            ? (() => {
                toast.error(
                  `Only ${item.in_stuck} items available for this size!`
                );
                return item;
              })()
            : { ...item, quantity }
          : item
      )
    );
  };

  // Remove specific item
  const removeFromCart = (productId, size) => {
    setCart((prev) =>
      prev.filter((item) => !(item._id === productId && item.size === size))
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    localStorage.removeItem("buyNowCart");
  };

  // Total items count
  const getTotalItems = () =>
    cart.reduce((total, item) => total + (item.quantity || 1), 0);

  // Total price
  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
