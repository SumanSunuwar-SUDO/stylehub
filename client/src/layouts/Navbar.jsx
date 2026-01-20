"use client";

import Link from "next/link";
import React, { useContext, useEffect, useState, useRef } from "react";
import Search from "@/UI/Search";
import Cart from "@/UI/Cart";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { baseURL } from "@/config/env";
import { toast } from "react-toastify";

const Navbar = () => {
  const { cart, getTotalItems } = useContext(CartContext);
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const router = useRouter();

  const [showDetails, setShowDetails] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

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
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getCategories();
  }, []);

  // Handle live search
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `${baseURL}/products/read?search=${encodeURIComponent(value)}`,
      );
      setSearchResults(res.data.result || []);
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Failed to search products!");
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/abouts" },
    { label: "Contact", href: "/contacts" },
    { label: "Products", href: "/products" },
  ];
  return (
    <nav className="h-[70px]  bg-white/90 ">
      <div className="max-w-[1400px] flex justify-between items-center container mx-auto h-full">
        {/* Logo */}
        <div className="flex items-center justify-between w-[70%]">
          <Link
            href="/"
            className="h-15 w-15 text-[24px] text-white font-bold flex items-center"
          >
            <img src="images/logo.png" alt="StyleHub" className="object-fill" />
          </Link>

          {/* Links */}
          <ul className="flex justify-center items-center ">
            {navItems.map((value, i) => {
              return (
                <ul key={value.label}>
                  <Link href={value.href} className="navLink">
                    {value.label}
                  </Link>
                </ul>
              );
            })}
            <li className="relative group">
              <span className="cursor-pointer navLink">Categories</span>
              <div className="absolute top-full left-0 bg-white shadow-2xl rounded-lg mt-3 min-w-[220px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out overflow-hidden">
                {categories.length > 0 ? (
                  categories.map((mainCat, index) => (
                    <div
                      key={mainCat._id}
                      className={index !== 0 ? "border-t border-gray-100" : ""}
                    >
                      <div className="px-5 py-3 font-bold">{mainCat._id}</div>
                      {mainCat.subCategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`/products?subCategory=${encodeURIComponent(
                            sub,
                          )}`}
                          className="block px-4 py-2 rounded-sm hover:bg-[#F16D34] hover:text-white hover:scale-105 transition-all ease-out duration-200"
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

            <li>
              <Link href="/products?category=men" className="navLink">
                Men
              </Link>
            </li>
            <li>
              <Link href="/products?category=women" className="navLink">
                Women
              </Link>
            </li>
          </ul>
        </div>

        {/* Right section */}
        <div className="flex items-center justify-end gap-4 relative h-full w-[30%]">
          {/* Search */}
          <div
            ref={searchRef}
            className="relative h-full flex items-center group"
            onMouseEnter={() => setShowSearch(true)}
            onMouseLeave={() => {
              setShowSearch(false);
              setSearchResults([]);
              setSearchTerm("");
            }}
          >
            {/* Search Icon Button */}
            {!showSearch && (
              <button className="text-gray-600 hover:text-black flex items-center justify-center h-full">
                <Search />
              </button>
            )}

            {/* Search Input */}
            {showSearch && (
              <div className="relative w-[280px] search-input-container">
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-600 hover:text-black flex items-center justify-center"
                  onClick={() => {
                    if (!searchTerm.trim()) return;
                    router.push(
                      `/products?search=${encodeURIComponent(searchTerm)}`,
                    );
                    setSearchTerm("");
                    setSearchResults([]);
                    setShowSearch(false);
                  }}
                >
                  <Search />
                </button>
                <input
                  type="text"
                  autoFocus
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-1.5 bg-white rounded-4xl outline-none border-2 border-gray-600 search-input-field"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!searchTerm.trim()) return;
                      router.push(
                        `/products?search=${encodeURIComponent(searchTerm)}`,
                      );
                      setSearchTerm("");
                      setSearchResults([]);
                      setShowSearch(false);
                    }
                  }}
                />

                {/* Live search dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-64 overflow-y-auto z-50">
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          router.push(`/products/${product._id}`);
                          setSearchResults([]);
                          setSearchTerm("");
                          setShowSearch(false);
                        }}
                      >
                        {product.productName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Cart */}
          <div className="relative cursor-pointer" onClick={cartClick}>
            <Cart />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {getTotalItems()}
              </span>
            )}
          </div>

          {/* Profile/Login */}
          {isLoggedIn && user ? (
            <div className="relative">
              <span
                className="h-8 w-8 rounded-full bg-orange-400 navLink cursor-pointer text-white font-semibold flex justify-center items-center hover:bg-blue-700"
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
