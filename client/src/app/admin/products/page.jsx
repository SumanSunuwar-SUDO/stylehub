"use client";

import { baseURL } from "@/config/env";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Search from "@/UI/Search";
import { toast } from "react-toastify";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchProducts = async (search = "") => {
    try {
      const url =
        search.trim() !== ""
          ? `${baseURL}/products/read?search=${search}`
          : `${baseURL}/products/read`;

      const res = await axios.get(url);
      setProducts(res.data.result || []);
    } catch (err) {
      toast.error("Failed to fetch products!");
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${baseURL}/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully!");
      setProducts(products.filter((p) => p._id !== id));
    } catch {
      toast.error("Failed to delete product!");
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/addproduct/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(searchTerm);
  };

  return (
    <main className="min-h-screen max-w-[1400px] mx-auto bg-[#F0E8E8]">
      <div className="h-[65px] bg-[#E67514] w-full flex justify-between items-center border-b px-5">
        <h2 className="text-2xl font-bold text-white">Products</h2>
      </div>

      <div className="my-5 px-5 flex justify-between items-center">
        <h1 className="text-xl font-bold">All Products</h1>
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center relative"
        >
          <input
            type="text"
            placeholder="Search by product name..."
            className="h-[35px] text-sm px-4 pr-10 rounded-md border bg-white border-gray-300 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 text-gray-500 hover:text-black"
          >
            <Search />
          </button>
        </form>
      </div>

      <div className="overflow-x-auto bg-white rounded-md shadow">
        <table className="w-full text-md font-normal">
          <thead className="bg-gray-300 border-b">
            <tr>
              <th className="text-left px-4 py-3">S.N.</th>
              <th className="text-left px-4 py-3">Image</th>
              <th className="text-left px-4 py-3">Product Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Size</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product, idx) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-100 transition-colors duration-250"
                >
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.productName}
                      className="h-20 w-20 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {product.productName}
                  </td>
                  <td className="px-4 py-3">{product.mainCategory}</td>
                  <td className="px-4 py-3">
                    {product.sizes?.map((s) => (
                      <div key={s._id}>{s.size}</div>
                    ))}
                  </td>
                  <td className="px-4 py-3">
                    {product.sizes?.map((s) => (
                      <div key={s._id}>
                        {s.quantity === 0 ? "Out of stock" : s.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3">
                    {product.sizes?.map((s) => (
                      <div key={s._id}>Rs. {s.price}</div>
                    ))}
                  </td>
                  <td className="px-4 py-3 space-x-3">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
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
    </main>
  );
};

export default Page;
