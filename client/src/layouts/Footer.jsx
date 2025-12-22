"use client";

import Facebook from "@/UI/Facebook";
import Instagram from "@/UI/Instagram";
import Tiktok from "@/UI/Tiktok";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#E67514] w-full py-5">
      <div className="flex flex-col md:flex-row justify-between items-start container mx-auto px-6 gap-8">
        {/* Brand */}
        <div>
          <h1 className="text-2xl text-white font-bold mb-2">
            Style<span className="text-blue-700">Hub</span>
          </h1>
          <p>
            Your go-to destination for trendy fashion and lifestyle essentials.
          </p>
        </div>

        {/* Quick Links */}
        <div className="">
          <h2 className="text-xl font-bold mb-2">Quick Links</h2>
          <ul className="space-y-1">
            <li>Home</li>
            <li>Products</li>
            <li>Categories</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="">
          <h2 className="text-xl font-bold mb-2">Connect With Us</h2>
          <ul className="space-y-1">
            <li className="hover:underline">Email: stylehub@gmail.com</li>
            <li>Location: Gokarneshwor, Kathmandu</li>
            <li>Phone: +977-9841234567</li>
          </ul>
          <p className="mt-2 mb-2">
            Stay connected with StyleHub on social media:
          </p>
          <div className="flex gap-4">
            <Facebook />
            <Instagram />
            <Tiktok />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
