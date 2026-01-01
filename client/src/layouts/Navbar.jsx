"use client";

import Link from "next/link";
import React, { useContext, useState } from "react";
import Search from "@/UI/Search";
import Cart from "@/UI/Cart";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";

const Navbar = () => {
  const { cart, getTotalItems } = useContext(CartContext);
  const { user, isLoggedIn, logout } = useContext(AuthContext); // <-- use AuthContext
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);
  const cartClick = () => router.push("/cart");

  const handleLogout = () => {
    logout(); // <-- call logout from AuthContext
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
        <Link href={"/"} className="text-[24px] text-white font-bold">
          Style<span className="text-blue-700">Hub</span>
        </Link>

        <div className="flex justify-center items-center gap-5 font-semibold text-[20px] pl-20">
          {links.map((link) => (
            <li key={link.label} className="list-none">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Cart */}
          <div className="relative cursor-pointer" onClick={cartClick}>
            <Cart />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {getTotalItems()}
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

          {/* Profile/Login */}
          {isLoggedIn && user ? (
            <div className="relative">
              <span
                className="h-[35px] w-[35px] rounded-full bg-blue-600 cursor-pointer text-white text-xl font-semibold flex justify-center items-center hover:bg-blue-700"
                onClick={toggleDetails}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>

              {showDetails && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg p-4 z-50">
                  <p className="text-sm font-semibold text-gray-800">
                    Hi, {user.name || user.username || "User"}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                  <div
                    className="px-3 py-2 border rounded-md text-md my-2 cursor-pointer"
                    onClick={() => router.push("/orders")}
                  >
                    My Orders
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-1 text-[18px] font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white rounded-md"
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
