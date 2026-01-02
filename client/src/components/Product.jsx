"use client";
import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({}); // track selected size per product
  const router = useRouter();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}/products/read`);
        setProducts(response.data.result || []);

        // Set default selected size for each product
        const defaultSizes = {};
        (response.data.result || []).forEach((product) => {
          if (product.sizes?.length > 0) {
            const available = product.sizes.find((s) => s.quantity > 0);
            defaultSizes[product._id] = available || product.sizes[0];
          }
        });
        setSelectedSizes(defaultSizes);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

  const goToProductDetails = (id) => router.push(`/products/${id}`);

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product._id];
    if (!selectedSize || selectedSize.quantity === 0) {
      alert("Please select a size that is in stock.");
      return;
    }

    addToCart(
      {
        _id: product._id,
        productName: product.productName,
        price: selectedSize.price,
        size: selectedSize.size,
        in_stuck: selectedSize.quantity,
        image: product.image.startsWith("http")
          ? product.image
          : `${baseURL}/images/${product.image}`,
      },
      1
    );
  };

  const buyNowHandler = (product) => {
    const selectedSize = selectedSizes[product._id];
    if (!selectedSize || selectedSize.quantity === 0) {
      alert("Please select a size that is in stock.");
      return;
    }

    const buyNowCart = [
      {
        _id: product._id,
        productName: product.productName,
        price: selectedSize.price,
        size: selectedSize.size,
        quantity: 1,
        in_stuck: selectedSize.quantity,
        image: product.image.startsWith("http")
          ? product.image
          : `${baseURL}/images/${product.image}`,
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
          products.map((item) => {
            const selected = selectedSizes[item._id];

            return (
              <div
                key={item._id}
                className="w-[250px] rounded-md p-5 shadow-md bg-white cursor-pointer"
                onClick={() => goToProductDetails(item._id)}
              >
                {/* Product Image */}
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

                {/* Product Name */}
                <h1 className="mt-2 font-semibold text-lg">
                  {item.productName}
                </h1>

                {/* Size Selection */}
                {item.sizes && item.sizes.length > 0 && (
                  <div className="mt-2 flex justify-between items-center">
                    <select
                      value={selected?.size || ""}
                      onChange={(e) =>
                        setSelectedSizes({
                          ...selectedSizes,
                          [item._id]: item.sizes.find(
                            (s) => s.size === e.target.value
                          ),
                        })
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="border w-[60px] px-2 py-1 rounded text-sm font-medium"
                    >
                      {item.sizes.map((s) => (
                        <option
                          key={s.size}
                          value={s.size}
                          disabled={s.quantity === 0}
                        >
                          {s.size} {s.quantity === 0 ? "(Out of stock)" : ""}
                        </option>
                      ))}
                    </select>

                    {selected && (
                      <p className="mt-1 text-sm font-medium">
                        Price: Rs.{selected.price}
                      </p>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between items-center mt-3">
                  <button
                    className="border-gray-600 px-3 py-2 cursor-pointer bg-[#F0E8E8] rounded-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
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
            );
          })
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </main>
  );
};

export default Product;
