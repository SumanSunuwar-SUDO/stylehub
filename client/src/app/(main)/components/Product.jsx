"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseURL } from "@/config/env";
import { useRouter, useSearchParams } from "next/navigation";
import { CartContext } from "@/context/CartContext";
import { toast } from "react-toastify";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const router = useRouter();
  const { addToCart } = useContext(CartContext);
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const subCategory = searchParams.get("subCategory") || "";

  useEffect(() => {
    const getProducts = async () => {
      try {
        let url = `${baseURL}/products/read?`;
        if (search.trim() !== "")
          url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `category=${encodeURIComponent(category)}&`;
        if (subCategory)
          url += `subCategory=${encodeURIComponent(subCategory)}&`;

        const response = await axios.get(url);
        const fetchedProducts = response.data.result || [];
        setProducts(fetchedProducts);

        // Set default selected size for each product
        const defaultSizes = {};
        fetchedProducts.forEach((product) => {
          if (product.sizes?.length > 0) {
            const available = product.sizes.find((s) => s.quantity > 0);
            defaultSizes[product._id] = available || product.sizes[0];
          }
        });
        setSelectedSizes(defaultSizes);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Try again later.");
      }
    };

    getProducts();
  }, [search, category, subCategory]);

  const goToProductDetails = (id) => router.push(`/products/${id}`);

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product._id];
    if (!selectedSize || selectedSize.quantity === 0) {
      toast.error("Please select a size that is in stock.");
      return;
    }

    const added = addToCart(
      {
        _id: product._id,
        productName: product.productName,
        price: selectedSize.price,
        size: selectedSize.size,
        in_stock: selectedSize.quantity,
        image: product.image.startsWith("http")
          ? product.image
          : `${baseURL}/images/${product.image}`,
      },
      1
    );

    if (added) {
      toast.success(
        `${product.productName} (${selectedSize.size}) added to cart!`
      );
    }
  };

  const buyNowHandler = (product) => {
    const selectedSize = selectedSizes[product._id];
    if (!selectedSize || selectedSize.quantity === 0) {
      toast.error("Please select a size that is in stock.");
      return;
    }

    const buyNowCart = [
      {
        _id: product._id,
        productName: product.productName,
        price: selectedSize.price,
        size: selectedSize.size,
        quantity: 1,
        in_stock: selectedSize.quantity,
        image: product.image.startsWith("http")
          ? product.image
          : `${baseURL}/images/${product.image}`,
      },
    ];

    localStorage.setItem("buyNowCart", JSON.stringify(buyNowCart));
    toast.success("Redirecting to checkout...");
    router.push("/checkout");
  };

  return (
    <main className="max-w-[1400px] mx-auto min-h-screen flex-col items-center justify-center px-16 pt-5 rounded-2xl mb-4 bg-[#F0E8E8]">
      <div className="flex justify-start mb-4">
        <h2 className="text-3xl font-bold">Products</h2>
      </div>

      <div className="flex justify-center">
        <div className="max-w-[1100px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10">
          {products.length > 0 ? (
            products.map((item) => {
              const selected = selectedSizes[item._id];

              return (
                <div
                  key={item._id}
                  className="w-[250px] rounded-md p-5 shadow-md bg-white cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
                  onClick={() => goToProductDetails(item._id)}
                >
                  <div className="h-[200px] bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
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

                  <h1 className="mt-2 font-semibold text-lg">
                    {item.productName}
                  </h1>

                  {item.sizes?.length > 0 && (
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
                        className="border w-[70px] px-2 py-1 rounded text-sm font-medium"
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

                  <div className="flex justify-between items-center mt-3">
                    <button
                      className="border-gray-600 px-3 py-2 bg-[#F0E8E8] rounded-xl text-sm font-medium hover:bg-blue-500 hover:text-white transition-all duration-250"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      Add To Cart
                    </button>

                    <button
                      className="border-gray-600 px-3 py-2 bg-[#F0E8E8] rounded-xl text-sm font-medium hover:bg-blue-500 hover:text-white transition-all duration-250"
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
      </div>
    </main>
  );
};

export default Product;
