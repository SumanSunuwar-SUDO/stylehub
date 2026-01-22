"use client";

import Hero from "@/app/(main)/components/Hero";
import Product from "@/app/(main)/components/Product";
import React from "react";

const page = () => {
  return (
    <section className="container mx-auto">
      <Hero />
      <Product limit={10} />
    </section>
  );
};

export default page;
