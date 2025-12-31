"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Search from "@/UI/Search";

const Page = () => {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${baseURL}/products/read`);
        console.log(res.data.result);
        setProducts(res.data.result || []);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

  return (
    <main className="min-h-screen max-w-[1400px] mx-auto bg-[#F0E8E8]">
      <div className="flex-col">
        {/* Header */}
        <div className="h-[65px] bg-[#E67514] w-full flex justify-between items-center border-b px-5">
          <h2 className="text-2xl font-bold text-white">Products</h2>
        </div>

        {/* Product List */}
        <div className="my-5 px-5 flex justify-between">
          <h1 className="text-xl font-bold ">All Products</h1>
          <div className="flex items-center relative">
            <input
              type="text"
              placeholder="Search by customer name..."
              className="h-[35px] text-sm px-4 pr-10 rounded-md border bg-[#ffffff] border-gray-300 outline-none"
            />
            <button className="absolute right-2 text-gray-500 hover:text-black">
              <Search />
            </button>
          </div>
        </div>

        {/* Table */}
        <div>
          <div className="overflow-x-auto bg-[#ffffff] rounded-md shadow">
            <table className="w-full text-md font-normal">
              <thead className="bg-gray-300 border-b">
                <tr>
                  <th className="text-left px-4 py-3">S.N.</th>
                  <th className="text-left px-4 py-3">Image</th>
                  <th className="text-left px-4 py-3">Product Name</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Size</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr
                      key={product._id}
                      className="border-b hover:bg-gray-100 transition-colors duration-250"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-25 w-25 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {product.productName}
                      </td>
                      <td className="px-4 py-3">Rs. {product.price}</td>
                      <td className="px-4 py-3">{product.size || "N/A"}</td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">{product.in_stuck}</td>
                      <td className="px-4 py-3 space-x-3">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/products/addproduct/${product._id}`
                            )
                          }
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/products/addproduct/${product._id}`
                            )
                          }
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
