"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Search from "@/UI/Search";
import Cart from "@/UI/Cart";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    if (token) {
      // Try different possible keys where user data might be stored
      const user = localStorage.getItem("user");
      const userData = localStorage.getItem("userData");

      console.log("user:", user);
      console.log("userData:", userData);

      if (user) {
        const parsed = JSON.parse(user);
        console.log("Parsed user:", parsed);
        setUserName(
          parsed.name || parsed.username || parsed.firstName || "User"
        );
        setUserEmail(parsed.email || "");
      } else if (userData) {
        const parsed = JSON.parse(userData);
        console.log("Parsed userData:", parsed);
        setUserName(
          parsed.name || parsed.username || parsed.firstName || "User"
        );
        setUserEmail(parsed.email || "");
      }
    }
  }, []);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const updateCartCount = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const totalItems = parsedCart.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      setCartCount(totalItems);
    } else {
      setCartCount(0);
    }
  };

  const cartClick = () => {
    router.push("/cart");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setShowDetails(false);
    router.push("/login");
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
  ];

  return (
    <nav className="h-[70px] bg-[#E67514] w-full">
      <div className="flex justify-between items-center container mx-auto h-full px-15">
        <h1 className="text-[24px] text-white font-bold">
          Style<span className="text-blue-700">Hub</span>
        </h1>

        <div className="flex justify-center items-center gap-5 font-semibold text-[20px] pl-20">
          {links.map((link) => (
            <li key={link.label} className="list-none">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <div className="relative cursor-pointer" onClick={cartClick}>
            <Cart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-1.5 pr-10 bg-white rounded-md outline-none"
            />
            <button className="absolute self-center right-4 text-gray-500 hover:text-black">
              <Search />
            </button>
          </div>

          {/* Login / Profile */}
          {isLoggedIn ? (
            <div className="relative">
              <span
                className="h-[30px] w-[30px] rounded-full bg-white cursor-pointer block"
                onClick={toggleDetails}
              ></span>

              {/* Dropdown */}
              {showDetails && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg p-4 z-50">
                  <p className="text-sm font-semibold text-gray-800">
                    Hi, {userName}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{userEmail}</p>
                  <div
                    className="px-3 py-2 border rounded-md text-md my-2"
                    onClick={() => {
                      router.push("/orders");
                    }}
                  >
                    My Orders
                  </div>
                  <button
                    onClick={handleLogout}
                    className=" w-full bg-red-500 text-white py-2 rounded-md text-sm hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-1 text-[18px] font-semibold bg-blue-600 text-white rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
