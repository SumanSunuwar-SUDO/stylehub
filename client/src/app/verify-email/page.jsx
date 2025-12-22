"use client";

import axios from "axios";
import { baseURL } from "@/config/env";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`${baseURL}/users/verify-mail`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Email verified successfully ");
        router.push("/login");
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-xl font-semibold">Verifying your email...</h2>
    </div>
  );
};

export default Page;
