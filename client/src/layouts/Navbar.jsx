"use client";

import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import Search from "@/UI/Search";
import Cart from "@/UI/Cart";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { baseURL } from "@/config/env";

const Navbar = () => {
  const { cart, getTotalItems } = useContext(CartContext);
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const router = useRouter();

  const [showDetails, setShowDetails] = useState(false);
  const [categories, setCategories] = useState([]);

  // Toggle profile dropdown
  const toggleDetails = () => setShowDetails(!showDetails);

  // Cart click
  const cartClick = () => router.push("/cart");

  // Logout
  const handleLogout = () => {
    logout();
    setShowDetails(false);
    router.push("/login");
  };

  // Fetch categories from backend
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get(`${baseURL}/categories/`);
        console.log(res.data);
        setCategories(res.data); // keep main categories + subcategories structure
      } catch (err) {
        console.error(err);
      }
    };
    getCategories();
  }, []);

  const links = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
  ];

  return (
    <nav className="h-[70px] bg-[#E67514] w-full">
      <div className="flex justify-between items-center container mx-auto h-full px-20">
        {/* Logo */}
        <Link href="/" className="text-[24px] text-white font-bold">
          Style<span className="text-blue-700">Hub</span>
        </Link>

        {/* Links */}
        <ul className="flex justify-center items-center gap-5 font-semibold text-xl pl-5">
          {links.map((link) => (
            <li key={link.label} className="list-none">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}

          <li className="relative list-none text-xl group">
            <span className="cursor-pointer transition-colors duration-200">
              Categories
            </span>
            <div className="absolute top-full left-0 bg-white shadow-2xl rounded-lg mt-3 min-w-[220px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out overflow-hidden">
              {categories.length > 0 ? (
                categories.map((mainCat, index) => (
                  <div
                    key={mainCat._id}
                    className={index !== 0 ? "border-t border-gray-100" : ""}
                  >
                    <div className="px-5 py-3 font-bold   from-orange-50 to-transparent">
                      {mainCat._id}
                    </div>
                    {mainCat.subCategories.map((sub) => (
                      <Link
                        key={sub}
                        href={`/products?category=${sub}`}
                        className="block px-6 py-2.5 text-gray-700  hover:from-blue-50 hover:to-transparent hover:pl-7 transition-all duration-200"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                ))
              ) : (
                <div className="px-5 py-3 text-gray-400">No categories</div>
              )}
            </div>
          </li>
        </ul>

        {/* Right section: Cart, Search, Profile/Login */}
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
                    className="px-3 py-2 border rounded-md text-md my-2 cursor-pointer hover:bg-gray-100"
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
