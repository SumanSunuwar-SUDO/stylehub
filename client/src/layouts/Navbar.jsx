"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Search from "@/UI/Search";
import Cart from "@/UI/Cart";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log(token);
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const cartClick = () => {
    router.push("/cart");
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
  ];

  return (
    <nav className="h-[70px] bg-[#E67514] w-full  ">
      <div className="flex justify-between items-center container mx-auto h-full px-15">
        <h1 className="text-[24px] text-white font-bold ">
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
          <div className="cursor-pointer" onClick={() => cartClick()}>
            <Cart />
          </div>
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-1.5 pr-10 bg-white rounded-md  outline-none"
            />
            <button className="absolute self-center right-4  text-gray-500 hover:text-black">
              <Search />
            </button>
          </div>

          {/* Login / Profile */}
          {isLoggedIn ? (
            <span className="h-[30px] w-[30px] rounded-full bg-white"></span>
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
