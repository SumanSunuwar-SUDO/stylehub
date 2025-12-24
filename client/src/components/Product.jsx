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

  const addToCart = (product) => {
    let cart = [];

    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }

    const existingProduct = cart.find((item) => item._id === product._id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        productName: product.productName,
        price: product.price,
        image: product.image,
        in_stuck: product.in_stuck,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart 🛒");
  };

  return (
    <main className="max-w-[1400px] mx-auto flex-col items-center justify-center px-16 rounded-2xl my-4  bg-[#F0E8E8]">
      <div className="flex justify-start mb-4">
        <h2 className="text-[24px] font-bold">Products</h2>
      </div>

      <div className="flex justify-start gap-10 flex-wrap pl-20">
        {products.length > 0 ? (
          products.map((item) => (
            <div
              key={item._id}
              className="w-[250px] rounded-md p-5 shadow-md  bg-[#ffffff]"
              onDoubleClick={() => goToProductDetails(item._id)}
            >
              <div className="h-[200px] bg-gray-200 flex items-center justify-center rounded-md">
                <img
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `${baseURL}/images/${item.image}`
                  }
                  alt={item.productName}
                  className="h-full w-full object-cover rounded-md"
                />
              </div>

              <div className="flex justify-between items-center py-2 ">
                <h1 className="mt-2 font-semibold text-lg">
                  {item.productName}
                </h1>
                <p className="text-lg pt-2">Rs.{item.price}</p>
              </div>
              <div className="flex justify-between items-center">
                <button
                  className="border-gray-600 px-3 py-2 cursor-pointer bg-[#F0E8E8] rounded-xl"
                  onClick={() => addToCart(item)}
                >
                  Add To Cart
                </button>

                <button className="border-gray-600 px-3 py-2 cursor-pointer bg-[#F0E8E8] rounded-xl">
                  Buy Now
                </button>
              </div>
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
