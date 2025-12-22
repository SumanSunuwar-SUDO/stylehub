"use client";

import React, { useState } from "react";

const Product = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);

  return (
    <main className="max-w-[1400px] mx-auto px-16 rounded-2xl my-4">
      {/* Products header */}
      <div className="flex justify-start mb-4">
        <h2 className="text-[24px] font-bold">Products</h2>
      </div>

      {/* Product card */}
      <div className="bg-white rounded-2xl shadow-md p-4 w-[200px]">
        <div className="h-[180px] bg-gray-200 flex items-center justify-center rounded-md">
          Product Image
        </div>
        <h1 className="mt-2 font-bold text-lg">Shirt</h1>
        <p className="text-gray-700">Rs.1200</p>
      </div>
    </main>
  );
};

export default Product;
