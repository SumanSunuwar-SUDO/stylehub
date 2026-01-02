"use client";
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item._id === product._id && item.size === product.size
      );

      if (existingItem) {
        if (existingItem.quantity + quantity > existingItem.in_stuck) {
          alert(
            `Cannot add more than ${existingItem.in_stuck} items for this size!`
          );
          return prevCart;
        }
        return prevCart.map((item) =>
          item._id === product._id && item.size === product.size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        if (quantity > product.in_stuck) {
          alert(
            `Cannot add more than ${product.in_stuck} items for this size!`
          );
          return prevCart;
        }
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const updateQuantity = (productId, quantity, size) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId && item.size === size
          ? quantity > item.in_stuck
            ? (() => {
                alert(`Only ${item.in_stuck} items available for this size!`);
                return item;
              })()
            : { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, size) => {
    setCart((prev) =>
      prev.filter((item) => !(item._id === productId && item.size === size))
    );
  };

  const clearCart = () => setCart([]);

  const getTotalItems = () =>
    cart.reduce((total, item) => total + (item.quantity || 1), 0);

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
