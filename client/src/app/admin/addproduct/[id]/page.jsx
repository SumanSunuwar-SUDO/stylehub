"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { baseURL } from "@/config/env";
import { toast } from "react-toastify";

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

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
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const mainCategories = {
    Clothing: ["T-Shirts", "Shirts", "Jeans", "Jackets", "Hoodies", "Shorts"],
    Footwear: ["Sneakers", "Formal Shoes", "Sandals", "Boots", "Sports Shoes"],
  };

  const sizeOptions = {
    Clothing: ["S", "M", "L", "XL", "XXL"],
    Footwear: [36, 37, 38, 39, 40, 41, 42],
  };

  // Fetch product to edit
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${baseURL}/products/read/${productId}`);
        const prod = res.data.result;

        if (!prod) {
          toast.error("Product not found");
          router.push("/admin/products");
          return;
        }

        setProduct({
          productName: prod.productName,
          mainCategory: prod.mainCategory,
          gender: prod.gender,
          subCategory: prod.subCategory,
          description: prod.description,
          image: prod.image,
        });
        setSizes(prod.sizes || []);
        setPreview(prod.image);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        toast.error("Failed to load product data");
        router.push("/admin/products");
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      toast.warn("No file selected");
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
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error("Image upload failed", err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Full Validation
    if (!product.productName.trim())
      return toast.error("Product name is required");
    if (!product.mainCategory) return toast.error("Main category is required");
    if (!product.gender) return toast.error("Gender is required");
    if (!product.subCategory) return toast.error("Subcategory is required");
    if (!product.description.trim())
      return toast.error("Description is required");
    if (!product.image) return toast.error("Product image is required");
    if (sizes.length === 0) return toast.error("Add at least one size");

    for (let i = 0; i < sizes.length; i++) {
      const s = sizes[i];
      if (!s.size) return toast.error(`Size at row ${i + 1} is missing`);
      if (s.quantity === "" || s.quantity < 0)
        return toast.error(`Quantity at row ${i + 1} is invalid`);
      if (s.price === "" || s.price < 0)
        return toast.error(`Price at row ${i + 1} is invalid`);
    }

    setLoading(true);
    const payload = { ...product, sizes };
    const token = localStorage.getItem("accessToken");

    try {
      await axios.patch(`${baseURL}/products/update/${productId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen max-w-[1400px] mx-auto bg-[#F0E8E8]">
      <header className="dashboard-header">
        <h2>Edit Product</h2>
      </header>

      <div className="my-5 bg-white rounded-2xl p-6 shadow-md">
        <h1 className="text-xl font-semibold mb-6">Edit Product</h1>

        <form className="flex gap-6 text-sm" onSubmit={handleSubmit}>
          {/* Left Column */}
          <div className="flex-1 grid grid-cols-1 gap-4">
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              placeholder="Product Name"
              className="px-3 py-2 rounded-xl w-full border border-gray-300"
              required
            />

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
                toast.info("Category changed, please select again");
              }}
              className="px-3 py-2 rounded-xl w-full border border-gray-300"
              required
            >
              <option value="">Select Category</option>
              {Object.keys(mainCategories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {product.mainCategory && (
              <select
                name="gender"
                value={product.gender}
                onChange={(e) =>
                  setProduct({ ...product, gender: e.target.value })
                }
                className="px-3 py-2 rounded-xl w-full border border-gray-300"
                required
              >
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            )}

            {product.mainCategory && product.gender && (
              <select
                name="subCategory"
                value={product.subCategory}
                onChange={handleChange}
                className="px-3 py-2 rounded-xl w-full border border-gray-300"
                required
              >
                <option value="">Select Subcategory</option>
                {mainCategories[product.mainCategory].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}

            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Description"
              className="px-3 py-2 rounded-xl w-full h-32 border border-gray-300"
              required
            />

            {/* Sizes */}
            {product.mainCategory && product.gender && product.subCategory && (
              <div>
                <label className="block font-medium mb-1">
                  Sizes / Stock / Price
                </label>

                {sizes.map((s, idx) => (
                  <div
                    key={s._id || idx}
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
                      placeholder="Stock"
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
                  onClick={() => {
                    setSizes([...sizes, { size: "", quantity: "", price: "" }]);
                    toast.success("Size added");
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Add Size
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || uploading}
              className={`bg-[#E67514] text-white px-5 py-2 rounded-xl w-full hover:bg-orange-600 ${
                loading || uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>

          {/* Right Column: Image */}
          <div className="w-1/3 flex flex-col items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
            {preview ? (
              <img
                src={preview}
                alt={product.productName}
                className="w-48 h-48 object-cover rounded-xl border border-gray-300"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                Preview
              </div>
            )}

            <label className="w-full flex flex-col items-center px-4 py-2 bg-[#E67514] text-white rounded-xl shadow-md cursor-pointer hover:bg-orange-600">
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

export default EditProductPage;
