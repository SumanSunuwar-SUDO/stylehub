"use client";

import dynamic from "next/dynamic";
import Footer from "@/layouts/Footer";

const Navbar = dynamic(() => import("@/layouts/Navbar"), {
  ssr: false,
});

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
