"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Cart from "@/UI/Cart";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log(token);
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  return (
    <nav className="h-[60px] bg-[#E67514] w-full  ">
      <div className="flex justify-between items-center container mx-auto h-full px-15">
        <h1 className="text-[24px] text-white font-bold ">
          Style<span className="text-blue-700">Hub</span>
        </h1>

        <ul className="flex gap-7 items-center justify-center text-[18px] font-medium">
          <li>Home</li>
          <li>Products</li>
          <li>Categories</li>
          <li>
            <input
              type="text"
              placeholder="Search"
              className="px-3 py-1 text-[16px] bg-white  rounded-md"
            />
          </li>
          <li>
            <Cart />
          </li>
        </ul>

        {isLoggedIn ? (
          <span className="h-[30px] w-[30px] rounded-full bg-white"></span>
        ) : (
          <Link
            href={"/login"}
            className="px-4 py-1 bg-blue-600 text-white rounded-md"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
