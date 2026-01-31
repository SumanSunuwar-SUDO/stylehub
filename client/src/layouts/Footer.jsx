"use client";

import EmailIcon from "@/UI/EmailIcon";
import Facebook from "@/UI/Facebook";
import Instagram from "@/UI/Instagram";
import LocationIcon from "@/UI/LocationIcon";
import PhoneIcon from "@/UI/PhoneIcon";
import Tiktok from "@/UI/Tiktok";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Products", href: "/products" },
  ];

  const mediaItems = [
    { label: "Facebook", icon: <Facebook />, href: "#" },
    { label: "Instagram", icon: <Instagram />, href: "#" },
    { label: "TikTok", icon: <Tiktok />, href: "#" },
  ];

  const connetWithUs = [
    {
      label: "Email",
      logo: <EmailIcon />,
      value: "stylehub@gmail.com",
    },
    {
      label: "Location",
      logo: <LocationIcon />,
      value: "Gokarneshwor, Kathmandu",
    },
    { label: "Phone", logo: <PhoneIcon />, value: "+977-9841234567" },
  ];
  return (
    <footer className="bg-white/90 w-full mt-10">
      <div className="flex flex-col lg:flex-row gap-20 container mx-auto px-15 py-7">
        {/* Brand */}
        <div className="lg:w-[45%]">
          <div className="flex items-center gap-2">
            <Link href="/" className="h-20 w-20  flex items-center bg-gray/80">
              <img
                src="images/logo.png"
                alt="StyleHub"
                className="object-fill"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#E67514]">StyleHub</h1>
              <p className="text-sm text-gray-600">Fashion & Lifestyle</p>
            </div>
          </div>
          <p className="text-justify">
            StyleHub is your one-stop destination for trendy fashion and
            lifestyle essentials, offering the latest styles to keep you looking
            and feeling your best.
          </p>
          <div className="flex gap-4 mt-3">
            {mediaItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="hover:text-[#E67514] hover:scale-110 transition-transform duration-200"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
        {/* Quick Links */}
        <div className="flex justify-between gap-x-32">
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
              {connetWithUs.map((item, index) => (
                <li key={index} className="flex items-center gap-2 ">
                  <span className="text-[#E67514]"> {item.logo}</span>

                  {item.value}
                </li>
              ))}
            </ul>
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
