"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import Plus from "@/UI/Plus";
import Minus from "@/UI/Minus";
import Back from "@/UI/Back";
import { CartContext } from "@/context/CartContext";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [count, setCount] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useContext(CartContext);

  // Fetch product details
  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`${baseURL}/products/read/${id}`);
        const data = res.data.result;
        setProduct(data);

        // Select first available size or default
        if (data?.sizes?.length > 0) {
          const firstAvailable = data.sizes.find((s) => s.quantity > 0);
          setSelectedSize(firstAvailable || data.sizes[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Quantity handlers
  const increment = () => {
    if (selectedSize && count < selectedSize.quantity) setCount(count + 1);
  };
  const decrement = () => {
    if (count > 1) setCount(count - 1);
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    addToCart(
      {
        _id: product._id,
        productName: product.productName,
        price: selectedSize.price,
        size: selectedSize.size,
        in_stuck: selectedSize.quantity, // <-- important
        image: product.image.startsWith("http")
          ? product.image
          : `${baseURL}/images/${product.image}`,
      },
      count
    );

    alert(`${product.productName} (${selectedSize.size}) added to cart!`);
  };

  // Buy now
  const buyNowHandler = () => {
    if (!product || !selectedSize) return;

    const buyNowCart = [
      {
        _id: product._id,
        productName: product.productName,
        price: selectedSize.price,
        size: selectedSize.size,
        quantity: count,
        image: product.image.startsWith("http")
          ? product.image
          : `${baseURL}/images/${product.image}`,
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
    <main className="max-w-[1400px] mx-auto flex-col items-center justify-center px-16 my-10">
      {/* Header */}
      <div className="flex text-3xl font-bold mb-5">
        <span
          className="py-2 pr-3 cursor-pointer"
          onClick={() => router.back() || router.push("/")}
        >
          <Back />
        </span>
        <h1>Product Details</h1>
      </div>

      {/* Product container */}
      <div className="flex justify-center">
        <div className="w-[1000px] flex-col bg-white rounded-2xl mt-5 shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Product Image */}
            <div className="h-[350px] w-[350px] m-10 bg-gray-200 flex items-center justify-center rounded-2xl">
              <img
                src={
                  product.image.startsWith("http")
                    ? product.image
                    : `${baseURL}/images/${product.image}`
                }
                alt={product.productName}
                className="h-full w-full object-cover rounded-2xl"
              />
            </div>

            {/* Product Info */}
            <div className="mx-5 mt-10 flex-1">
              <h1 className="mt-4 text-2xl font-bold">{product.productName}</h1>

              {/* Category */}
              <p className="mt-3 text-xl font-medium">
                Category: {product.gender || product.category || "N/A"}
              </p>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="my-2 text-xl font-medium">
                  <label className="font-semibold">Select Size: </label>
                  <select
                    value={selectedSize?.size || ""}
                    onChange={(e) => {
                      const newSize = product.sizes.find(
                        (s) => s.size === e.target.value
                      );
                      setSelectedSize(newSize);
                      setCount(1); // reset quantity on size change
                    }}
                    className="w-24 px-2 py-1 border rounded mt-1"
                  >
                    {product.sizes.map((s) => (
                      <option
                        key={s.size}
                        value={s.size}
                        disabled={s.quantity === 0}
                      >
                        {s.size} {s.quantity === 0 ? "(Out of stock)" : ""}
                      </option>
                    ))}
                  </select>
                  {selectedSize && (
                    <p className="mt-2 text-xl font-semibold">
                      Price: Rs.{selectedSize.price}
                    </p>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="flex gap-2 text-xl font-semibold items-center mt-2">
                <h1>Quantity:</h1>
                <button
                  className="px-2 py-2 rounded-xl bg-[#F0E8E8]"
                  onClick={decrement}
                >
                  <Minus />
                </button>
                <span className="px-2">{count}</span>
                <button
                  className="px-2 py-2 rounded-xl bg-[#F0E8E8]"
                  onClick={increment}
                  disabled={selectedSize && count >= selectedSize.quantity}
                >
                  <Plus />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-5 mt-3">
                <button
                  className="px-10 py-3 font-semibold border rounded-2xl bg-[#F0E8E8]"
                  onClick={handleAddToCart}
                  disabled={!selectedSize || selectedSize.quantity === 0}
                >
                  Add to Cart
                </button>
                <button
                  className="px-10 py-3 font-semibold border rounded-2xl bg-[#F0E8E8]"
                  onClick={buyNowHandler}
                  disabled={!selectedSize || selectedSize.quantity === 0}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-10 pb-10 text-[20px] font-semibold">
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
