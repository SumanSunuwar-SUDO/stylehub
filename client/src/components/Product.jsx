"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Product = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}/products/read`);
        console.log(response.data);
        setProducts(response.data.result || []);
      } catch (error) {
        console.log(error);
      }
    };

    getProducts();
  }, []);

  // Navigate to product details page
  const goToProductDetails = (id) => {
    router.push(`/products/${id}`);
  };

  return (
    <main className="max-w-[1400px] mx-auto flex-col items-center justify-center px-16 rounded-2xl my-4">
      <div className="flex justify-start mb-4">
        <h2 className="text-[24px] font-bold">Products</h2>
      </div>

      <div className="flex justify-center items-center gap-15 flex-wrap">
        {products.length > 0 ? (
          products.map((item) => (
            <div
              key={item._id}
              className="w-[230px] rounded-md p-5 shadow-md cursor-pointer"
              onClick={() => goToProductDetails(item._id)}
            >
              <div className="h-[200px] bg-gray-200 flex items-center justify-center rounded-md">
                <h1>{item.image}</h1>
              </div>
              <h1 className="mt-2 font-bold text-lg">{item.productName}</h1>
              <p className="text-gray-700">Rs.{item.price}</p>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </main>
  );
};

export default Product;
