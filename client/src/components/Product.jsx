"use client";
import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";

const Product = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}/products/read`);
        setProducts(response.data.result || []);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

  const goToProductDetails = (id) => router.push(`/products/${id}`);

  const buyNowHandler = (product, count = 1) => {
    const buyNowCart = [
      {
        _id: product._id,
        productName: product.productName,
        price: product.price,
        image: product.image.startsWith("http")
          ? product.image
          : `${baseURL}/images/${product.image}`,
        size: product.size || "N/A",
        quantity: count,
      },
    ];

    localStorage.setItem("buyNowCart", JSON.stringify(buyNowCart));
    router.push("/checkout");
  };

  return (
    <main className="max-w-[1400px] mx-auto flex-col items-center justify-center px-16 rounded-2xl mb-4 bg-[#F0E8E8]">
      <div className="flex justify-start mb-4">
        <h2 className="text-3xl font-bold">Products</h2>
      </div>

      <div className="flex justify-start gap-10 flex-wrap pl-20 mt-10">
        {products.length > 0 ? (
          products.map((item) => (
            <div
              key={item._id}
              className="w-[250px] rounded-md p-5 shadow-md bg-white cursor-pointer"
              onClick={() => goToProductDetails(item._id)}
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

              <div className="flex justify-between items-center py-2">
                <h1 className="mt-2 font-semibold text-lg">
                  {item.productName}
                </h1>
                <p className="text-lg pt-2">Rs.{item.price}</p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  className="border-gray-600 px-3 py-2 cursor-pointer bg-[#F0E8E8] rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                >
                  Add To Cart
                </button>

                <button
                  className="border-gray-600 px-3 py-2 cursor-pointer bg-[#F0E8E8] rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    buyNowHandler(item);
                  }}
                >
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
