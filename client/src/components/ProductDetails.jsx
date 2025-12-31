"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Plus from "@/UI/Plus";
import Minus from "@/UI/Minus";
import Back from "@/UI/Back";
import { addToCart } from "@/utils/cart";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [count, setCount] = useState(1);
  const params = useParams();
  const { id } = params;
  const router = useRouter();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`${baseURL}/products/read/${id}`);
        setProduct(res.data.result);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  // Safe increment and decrement functions
  const increment = () => {
    if (product && count < product.in_stuck) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const buyNowHandler = (product, count) => {
    const imageURL = product.image.startsWith("http")
      ? product.image
      : `${baseURL}/images/${product.image}`;

    const buyNowCart = [
      {
        _id: product._id,
        productName: product.productName,
        price: product.price,
        size: product.size,
        image: imageURL,
        in_stuck: product.in_stuck,
        quantity: count,
      },
    ];

    localStorage.setItem("buyNowCart", JSON.stringify(buyNowCart));
    router.push("/checkout");
  };

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading Product Details...</h2>
      </div>
    );

  return (
    <main className="max-w-[1400px] mx-auto flex-col items-center justify-center px-16 rounded-2xl my-10">
      <div className="flex text-3xl font-bold">
        <div className="p-1" onClick={() => router.push("/products")}>
          <Back />
        </div>
        <h1>Product Details</h1>
      </div>

      <div className="flex justify-center">
        <div className="w-[1000px] flex-col bg-white rounded-2xl mt-5 shadow-2xl">
          <div className="flex">
            <div className="h-[350px] w-[350px] m-10 bg-gray-200 flex items-center justify-center rounded-2xl">
              <img
                src={product.image}
                alt={product.productName}
                className="h-full w-full object-cover rounded-2xl"
              />
            </div>

            <div className="mx-5 mt-10">
              <h1 className="mt-4 text-2xl font-bold">{product.productName}</h1>
              <p className="mt-2 text-xl font-semibold">
                Price: Rs.{product.price}
              </p>
              <p className="mt-2 text-xl font-semibold">Size: {product.size}</p>
              <p className="mt-2 text-xl font-semibold">
                Category: {product.category}
              </p>
              <p className="mt-2 text-xl font-semibold">
                In Stock:{product.in_stuck}
              </p>

              <div className="flex py-3 gap-2 text-xl font-semibold">
                <h1 className="py-2">Quantity:</h1>

                <button
                  className="px-2 rounded-xl bg-[#F0E8E8]"
                  onClick={decrement}
                >
                  <Minus />
                </button>
                <h1 className="p-2">{count}</h1>
                <button
                  className="px-2 rounded-xl bg-[#F0E8E8]"
                  onClick={increment}
                >
                  <Plus />
                </button>
              </div>

              <div className="flex gap-5">
                <button
                  className="px-10 py-3 font-semibold border rounded-2xl bg-[#F0E8E8]"
                  onClick={() => {
                    addToCart(product, count);
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="px-10 py-3 font-semibold border rounded-2xl bg-[#F0E8E8]"
                  onClick={() => {
                    buyNowHandler(product, count);
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          <div className="px-15 pb-10 text-[20px] font-semibold">
            Description:
            <p className="text-xl font-normal mt-2 text-justify">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
