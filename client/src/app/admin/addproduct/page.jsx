"use client";

import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "@/config/env";

const page = () => {
  const [product, setProduct] = useState({
    productName: "",
    mainCategory: "",
    gender: "",
    subCategory: "",
    description: "",
    image: "",
  });

  const [sizes, setSizes] = useState([]); // [{ size: 'S', quantity: 5, price: 100 }]
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const mainCategories = {
    Clothing: ["T-Shirts", "Shirts", "Jeans", "Jackets", "Hoodies", "Shorts"],
    Footwear: ["Sneakers", "Formal Shoes", "Sandals", "Boots", "Sports Shoes"],
  };

  const sizeOptions = {
    Clothing: ["S", "M", "L", "XL", "XXL"],
    Footwear: [6, 7, 8, 9, 10, 11, 12],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      setUploading(true);
      const res = await axios.post(`${baseURL}/file/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProduct((prev) => ({ ...prev, image: res.data.imageUrl }));
      setUploading(false);
    } catch (err) {
      setUploading(false);
      console.error("Image upload failed", err);
      alert("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.image) {
      alert("Please upload an image first!");
      return;
    }

    if (sizes.length === 0) {
      alert("Please add at least one size with quantity and price!");
      return;
    }

    const payload = { ...product, sizes };

    try {
      const token = localStorage.getItem("accessToken"); // Get token
      const res = await axios.post(`${baseURL}/products/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`, // <-- send token here
        },
      });
      console.log("Product created", res.data);
      alert("Product created successfully!");

      // Reset form
      setProduct({
        productName: "",
        mainCategory: "",
        gender: "",
        subCategory: "",
        description: "",
        image: "",
      });
      setSizes([]);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Product creation failed", err);
      alert("Failed to create product");
    }
  };

  return (
    <main className="min-h-screen max-w-[1400px] mx-auto bg-[#F0E8E8]">
      {/* Header */}
      <div className="h-[65px] bg-[#E67514] w-full flex justify-between items-center border-b px-5">
        <h2 className="text-xl font-semibold text-white">Add Product</h2>
      </div>

      <div className="my-5 bg-white rounded-2xl p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

        <form className="flex gap-6" onSubmit={handleSubmit}>
          {/* Left Column */}
          <div className="flex-1 grid grid-cols-1 gap-4">
            {/* Product Name */}
            <div>
              <label className="block font-medium mb-1">Product Name:</label>
              <input
                type="text"
                name="productName"
                value={product.productName || ""}
                onChange={handleChange}
                placeholder="Enter product name"
                className="px-3 py-2 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* Main Category */}
            <div>
              <label className="block font-medium mb-1">Category:</label>
              <select
                name="mainCategory"
                value={product.mainCategory || ""}
                onChange={(e) => {
                  const selectedMain = e.target.value;
                  setProduct({
                    ...product,
                    mainCategory: selectedMain,
                    gender: "",
                    subCategory: "",
                  });
                  setSizes([]);
                }}
                className="px-3 py-2 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              >
                <option value="">Select Category</option>
                {Object.keys(mainCategories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            {product.mainCategory && (
              <div>
                <label className="block font-medium mb-1">Gender:</label>
                <select
                  name="gender"
                  value={product.gender || ""}
                  onChange={(e) =>
                    setProduct({ ...product, gender: e.target.value })
                  }
                  className="px-3 py-2 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                </select>
              </div>
            )}

            {/* Subcategory */}
            {product.mainCategory && product.gender && (
              <div>
                <label className="block font-medium mb-1">Subcategory:</label>
                <select
                  name="subCategory"
                  value={product.subCategory || ""}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                >
                  <option value="">Select Subcategory</option>
                  {mainCategories[product.mainCategory].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sizes Table */}
            {product.mainCategory && product.gender && product.subCategory && (
              <div>
                <label className="block font-medium mb-1">
                  Sizes / Quantity / Price:
                </label>
                {sizes.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 mb-2 items-center flex-wrap"
                  >
                    <select
                      value={s.size}
                      onChange={(e) => {
                        const newSizes = [...sizes];
                        newSizes[idx].size = e.target.value;
                        setSizes(newSizes);
                      }}
                      className="px-2 py-1 rounded border border-gray-300"
                      required
                    >
                      <option value="">Select Size</option>
                      {sizeOptions[product.mainCategory].map((sz) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min={0}
                      value={s.quantity}
                      onChange={(e) => {
                        const newSizes = [...sizes];
                        newSizes[idx].quantity = e.target.value;
                        setSizes(newSizes);
                      }}
                      placeholder="Quantity"
                      className="px-2 py-1 rounded border border-gray-300 w-24"
                      required
                    />

                    <input
                      type="number"
                      min={0}
                      value={s.price}
                      onChange={(e) => {
                        const newSizes = [...sizes];
                        newSizes[idx].price = e.target.value;
                        setSizes(newSizes);
                      }}
                      placeholder="Price"
                      className="px-2 py-1 rounded border border-gray-300 w-24"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setSizes(sizes.filter((_, i) => i !== idx))
                      }
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setSizes([...sizes, { size: "", quantity: "", price: "" }])
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Add Size
                </button>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">Description:</label>
              <textarea
                name="description"
                value={product.description || ""}
                onChange={handleChange}
                placeholder="Enter product description"
                className="px-3 py-2 rounded-xl w-full h-32 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Submit Button (inside form) */}
            <button
              type="submit"
              disabled={uploading}
              className={`bg-[#E67514] text-white px-5 py-2 rounded-xl w-full hover:bg-orange-600 transition ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Add Product
            </button>
          </div>

          {/* Right Column: Image Upload */}
          <div className="w-1/3 flex flex-col items-center justify-start gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <label className="block font-medium mb-1">Product Image:</label>

            {preview ? (
              <img
                src={preview}
                alt="Selected Image"
                className="w-48 h-48 object-cover rounded-xl border border-gray-300"
              />
            ) : product.image ? (
              <img
                src={product.image}
                alt={product.productName}
                className="w-48 h-48 object-cover rounded-xl border border-gray-300"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                Preview
              </div>
            )}

            <label className="w-full flex flex-col items-center px-4 py-2 bg-[#E67514] text-white rounded-xl shadow-md tracking-wide cursor-pointer hover:bg-orange-600 transition">
              <span className="text-sm font-medium">Choose File</span>
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {uploading && <p className="text-orange-500 mt-1">Uploading...</p>}
          </div>
        </form>
      </div>
    </main>
  );
};

export default page;
