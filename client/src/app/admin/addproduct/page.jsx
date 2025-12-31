"use client";

import React, { useState } from "react";
import axios from "axios";

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
  const [preview, setPreview] = useState(null); // live preview
  const [uploading, setUploading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    } else {
      setPreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = product.image;

    // Step 1: Upload image if file selected
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        setUploading(true);
        const res = await axios.post("YOUR_IMAGE_UPLOAD_API_URL", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.imageUrl; // adjust according to your API
        setProduct((prev) => ({ ...prev, image: imageUrl }));
        setUploading(false);
      } catch (err) {
        setUploading(false);
        console.error("Image upload failed", err);
        return;
      }
    }

    // Step 2: Create product
    try {
      const res = await axios.post("YOUR_CREATE_PRODUCT_API_URL", {
        ...product,
        image: imageUrl,
      });
      console.log("Product created", res.data);
      alert("Product created successfully!");
      // Optionally reset form
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
    <main className="min-h-screen max-w-[1400px] mx-auto bg-[#F0E8E8]">
      {/* Header */}
      <div className="h-[65px] bg-[#E67514] w-full flex justify-between items-center border-b px-5">
        <h2 className="text-xl font-semibold text-white">Add Product</h2>
      </div>

      <div className="m-5 bg-white rounded-2xl p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

        <form className="flex gap-6" onSubmit={handleSubmit}>
          {/* Left Column: Product Details */}
          <div className="flex-1 grid grid-cols-1 gap-4">
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

            <div>
              <label className="block font-medium mb-1">Price:</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="px-3 py-2 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Size:</label>
              <input
                type="text"
                name="size"
                value={product.size}
                onChange={handleChange}
                placeholder="Enter size"
                className="px-3 py-2 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Stock:</label>
              <input
                type="number"
                name="in_stuck"
                value={product.in_stuck}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="px-3 py-2 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Category:</label>
              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                placeholder="Enter category"
                className="px-3 py-2 rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description:</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="px-3 py-2 rounded-xl w-full h-32 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Right Column: Image Upload */}
          <div className="w-1/3 flex flex-col items-center justify-start gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <label className="block font-medium mb-1">Product Image:</label>

            {/* Show preview if file selected, else existing image, else placeholder */}
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

            <label className="w-full flex flex-col items-center px-4 py-2 bg-white text-blue-700 rounded-xl shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition">
              <span className="text-sm font-medium">Choose File</span>
              <input
                type="file"
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
            className="bg-[#E67514] text-white px-5 py-2 rounded-xl w-full hover:bg-orange-600 transition"
          >
            Add Product
          </button>
        </div>
      </div>
    </main>
  );
};

export default page;
