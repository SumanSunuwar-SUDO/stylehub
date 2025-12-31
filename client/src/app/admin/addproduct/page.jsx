"use client";

import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "@/config/env";

const page = () => {
  const [product, setProduct] = useState({
    productName: "",
    price: "",
    size: "",
    in_stuck: "",
    category: "",
    image: "", // uploaded image URL
    description: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle file selection, preview, and upload
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Show preview immediately
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);

    // Upload image immediately
    const formData = new FormData();
    formData.append("document", selectedFile); // backend expects 'document'

    try {
      setUploading(true);
      const res = await axios.post(`${baseURL}/file/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProduct((prev) => ({ ...prev, image: res.data.imageUrl })); // backend returns `result`
      setUploading(false);
    } catch (err) {
      setUploading(false);
      console.error("Image upload failed", err);
      alert("Image upload failed");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.image) {
      alert("Please upload an image first!");
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/products/create`, product);
      console.log("Product created", res.data);
      alert("Product created successfully!");

      // Reset form
      setProduct({
        productName: "",
        price: "",
        size: "",
        in_stuck: "",
        category: "",
        image: "",
        description: "",
      });
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Product creation failed", err);
      alert("Failed to create product");
    }
  };

  return (
    <main className="min-h-screen max-w-[1400px] mx-auto bg-[#F0E8E8] p-5">
      {/* Header */}
      <div className="h-[65px] bg-[#E67514] w-full flex justify-between items-center border-b px-5 rounded-lg">
        <h2 className="text-xl font-semibold text-white">Add Product</h2>
      </div>

      <div className="my-5 bg-white rounded-2xl p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

        <form className="flex gap-6" onSubmit={handleSubmit}>
          {/* Left Column: Product Details */}
          <div className="flex-1 grid grid-cols-1 gap-4">
            {["productName", "price", "size", "in_stuck", "category"].map(
              (field) => (
                <div key={field}>
                  <label className="block font-medium mb-1">
                    {field.replace("_", " ").toUpperCase()}:
                  </label>
                  <input
                    type={
                      field === "price" || field === "in_stuck"
                        ? "number"
                        : "text"
                    }
                    name={field}
                    min={
                      field === "price" || field === "in_stuck" ? 0 : undefined
                    }
                    value={product[field] || ""} // Prevent undefined (fixes hydration)
                    onChange={handleChange}
                    placeholder={`Enter ${field.replace("_", " ")}`}
                    className="px-3 py-2 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required={field === "productName" || field === "price"}
                  />
                </div>
              )
            )}

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

            {/* Styled File Input */}
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

        {/* Submit Button Full Width Below */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className={`bg-[#E67514] text-white px-5 py-2 rounded-xl w-full hover:bg-orange-600 transition ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Add Product
          </button>
        </div>
      </div>
    </main>
  );
};

export default page;
