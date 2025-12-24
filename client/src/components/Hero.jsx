"use client";

import Forward from "@/UI/Forward";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Hero = () => {
  const router = useRouter();

  return (
    <main className="max-w-[1400px] mx-auto min-h-screen flex items-center px-16">
      <div className="flex flex-col">
        <h1 className="text-[60px] font-extrabold mb-4">
          Welcome to <span className="text-[#E67514]">StyleHub</span>
        </h1>

        <h2 className="text-[48px] font-bold mb-3">
          Discover Your Style, Define Your Confidence
        </h2>

        <p className="text-[24px] text-gray-600 max-w-[600px]">
          Fashion that fits your lifestyle — modern, comfortable, and made for
          everyday confidence.
        </p>
        <div className="mt-7">
          <button
            onClick={() => router.push("/products")}
            className="flex justify-center items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <h1>Find Your Product</h1>
            <Forward />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Hero;
