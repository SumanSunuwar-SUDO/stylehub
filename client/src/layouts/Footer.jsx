"use client";

import Facebook from "@/UI/Facebook";
import Instagram from "@/UI/Instagram";
import Tiktok from "@/UI/Tiktok";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/" },
    { label: "Contact Us", href: "/" },
    { label: "Products", href: "/products" },
  ];

  const mediaItems = [
    { label: "Facebook", icon: <Facebook />, href: "#" },
    { label: "Instagram", icon: <Instagram />, href: "#" },
    { label: "TikTok", icon: <Tiktok />, href: "#" },
  ];
  return (
    <footer className="bg-white/90 w-full mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start container mx-auto px-15 py-7 gap-8">
        {/* Brand */}
        <div className="w-[35%]">
          <Link href="/" className="h-20 w-20  flex items-center">
            <img src="images/logo.png" alt="StyleHub" className="object-fill" />
          </Link>
          <p className="text-justify">
            StyleHub is your one-stop destination for trendy fashion and
            lifestyle essentials, offering the latest styles to keep you looking
            and feeling your best.
          </p>
        </div>
        {/* Quick Links */}
        <div className="">
          <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-1">
            {quickLinks.map((link) => (
              <li key={link.label} className=" hover:underline">
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Contact */}
        <div className="">
          <h2 className="text-xl font-semibold mb-2">Connect With Us</h2>
          <ul className="space-y-1">
            <li className="hover:underline">Email: stylehub@gmail.com</li>
            <li>Location: Gokarneshwor, Kathmandu</li>
            <li>Phone: +977-9841234567</li>
          </ul>
          <p className="mt-2 mb-2">
            Stay connected with StyleHub on social media:
          </p>
          <div className="flex gap-4 mt-3">
            {mediaItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="hover:scale-110 transition-transform duration-200"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center py-7 border-t mx-15">
        &copy; {new Date().getFullYear()} StyleHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
