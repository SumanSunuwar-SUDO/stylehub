"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Sidebar() {
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  const links = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Products", href: "/admin/products" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Add Product", href: "/admin/addproduct" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="w-64 bg-[#ffffff] text-black border-r">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold p-4 bg-[#F0E8E8]">StyleHub Admin</h2>
        <nav className="flex flex-col p-4 space-y-2 border-t">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:bg-gray-400 transition-all duration-300 hover:text-xl hover:pl-5 p-2 rounded"
            >
              {link.label}
            </Link>
          ))}

          {/* Logout button just below the links */}
          <button
            onClick={handleLogout}
            className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 hover:shadow-2xl transition-all duration-300"
          >
            Logout
          </button>
        </nav>
      </div>
    </main>
  );
}
