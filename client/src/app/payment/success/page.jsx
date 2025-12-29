"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    alert("Payment successful!");
    router.push("/orders");
  }, []);
  return <div>Payment Success</div>;
};

export default page;
