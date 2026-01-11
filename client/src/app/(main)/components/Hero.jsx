"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

// Safe import of Forward with fallback
let ForwardIcon;
try {
  ForwardIcon = require("@/UI/Forward").default;
} catch (e) {
  console.warn("Forward component not found, using fallback arrow.");
  ForwardIcon = () => <span>→</span>; // fallback icon
}

const Hero = () => {
  const router = useRouter();

  const handleExploreClick = () => {
    toast.info("Redirecting to products...");
    router.push("/products");
  };

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
            onClick={handleExploreClick}
            className="flex justify-center items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <h1>Explore Products</h1>
            <ForwardIcon />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Hero;
