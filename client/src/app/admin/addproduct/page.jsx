"use client";

import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "@/config/env";
import { toast } from "react-toastify";

const Page = () => {
  const [product, setProduct] = useState({
    productName: "",
    mainCategory: "",
    gender: "",
    subCategory: "",
    description: "",
    image: "",
  });

  const [sizes, setSizes] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const mainCategories = {
    Clothing: ["T-Shirts", "Shirts", "Jeans", "Jackets", "Hoodies", "Shorts"],
    Footwear: ["Sneakers", "Formal Shoes", "Sandals", "Boots", "Sports Shoes"],
  };

  const sizeOptions = {
    Clothing: ["S", "M", "L", "XL", "XXL"],
    Footwear: [36, 37, 38, 39, 40, 41, 42],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      toast.warn("No file selected!");
      return;
    }

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
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Image upload failed", err);
      toast.error("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting || uploading) return;

    // VALIDATION
    if (!product.productName.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!product.mainCategory) {
      toast.error("Please select main category");
      return;
    }
    if (!product.gender) {
      toast.error("Please select gender");
      return;
    }
    if (!product.subCategory) {
      toast.error("Please select subcategory");
      return;
    }
    if (!product.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!product.image) {
      toast.error("Please upload product image");
      return;
    }
    if (sizes.length === 0) {
      toast.error("Please add at least one size");
      return;
    }

    // Validate each size entry
    for (let s of sizes) {
      if (!s.size || !s.quantity || !s.price) {
        toast.error("Please fill all size, quantity, and price fields");
        return;
      }
      if (Number(s.quantity) <= 0) {
        toast.error("Quantity must be greater than 0");
        return;
      }
      if (Number(s.price) <= 0) {
        toast.error("Price must be greater than 0");
        return;
      }
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("accessToken");

      const payload = { ...product, sizes };

      await axios.post(`${baseURL}/products/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product created successfully!");

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
      toast.error(err?.response?.data?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen max-w-[1400px] mx-auto bg-[#F0E8E8]">
      <header className="dashboard-header">
        <h2>Add Products</h2>
      </header>

      <div className="m-5 bg-white rounded-2xl p-6 shadow-md">
        <h1 className="text-xl font-semibold mb-6">Add New Product</h1>

        <form
          className="flex flex-col md:flex-row gap-6 text-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex-1 grid grid-cols-1 gap-4">
            {/* Product Name */}
            <div>
              <label className="block font-medium mb-1">Product Name:</label>
              <input
                type="text"
                name="productName"
                value={product.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                className="px-3 py-2 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium mb-1">Category:</label>
              <select
                name="mainCategory"
                value={product.mainCategory}
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
                  value={product.gender}
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
                  value={product.subCategory}
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

            {/* Sizes */}
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
                      onClick={() => {
                        setSizes(sizes.filter((_, i) => i !== idx));
                        toast.info("Size removed");
                      }}
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
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="px-3 py-2 rounded-xl w-full h-32 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || submitting}
              className={`bg-[#E67514] text-white px-5 py-2 rounded-xl w-full transition ${
                uploading || submitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-orange-600"
              }`}
            >
              {submitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>

          {/* Image Upload */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-start gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
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

            <label className="w-full flex flex-col items-center px-4 py-2 bg-[#E67514] text-white rounded-xl shadow-md cursor-pointer hover:bg-orange-600 transition">
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

export default Page;
