"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Failure() {
  const router = useRouter();

  useEffect(() => {
    alert("Payment failed. Try again!");
    router.push("/checkout");
  }, []);

  return <div>Payment Failed...</div>;
}
