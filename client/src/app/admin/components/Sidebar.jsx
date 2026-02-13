"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Home from "@/UI/Home";
import Product from "@/UI/Product";
import Clipboard from "@/UI/Clipboard";
import AddProductIcon from "@/UI/AddProductIcon";
import LogoutIcon from "@/UI/LogoutIcon";
import Shopping from "@/UI/Shopping";

export default function Sidebar() {
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  const links = [
    { label: "Dashboard", icon: <Home />, href: "/admin/dashboard" },
    { label: "Products", icon: <Product />, href: "/admin/products" },
    { label: "Orders", icon: <Clipboard />, href: "/admin/orders" },
    {
      label: "Add Product",
      icon: <AddProductIcon />,
      href: "/admin/addproduct",
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="w-64 bg-[#ffffff] text-black border-r">
      <div className="flex flex-col">
        <h2 className="text-xl text-gray-800 font-bold p-4 bg-[#E67514] flex items-center justify-start gap-2">
          StyleHub Admin
          <span>
            <Shopping />
          </span>
        </h2>
        <nav className="flex flex-col p-4 space-y-2 border-t">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`p-2 flex items-center  gap-2 rounded transition-all duration-300 hover:bg-[#E67514] hover:text-white hover:pl-5 `}
            >
              {link.icon} {link.label}
            </Link>
          ))}

          {/* Logout button just below the links */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full  text-white py-2 rounded bg-[#E67514] hover:bg-[#C25A00] transition-all duration-300"
          >
            <span className="flex items-center justify-start pl-2 gap-2">
              {" "}
              <LogoutIcon /> Logout
            </span>
          </button>
        </nav>
      </div>
    </main>
  );
}
