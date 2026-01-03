"use client";

import axios from "axios";
import { baseURL } from "@/config/env";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        toast.error(
          "Verification token is missing. Please check your email link."
        );
        router.push("/resend-verification");
        return;
      }

      try {
        await axios.get(`${baseURL}/users/verify-mail`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Email verified successfully!");
        router.push("/login");
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.message ||
            "Token invalid or expired. Please resend verification."
        );
        router.push("/resend-verification");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-xl font-semibold">Verifying your email...</h2>
    </div>
  );
};

export default Page;
