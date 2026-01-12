"use client";

import axios from "axios";
import { baseURL } from "@/config/env";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);

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
        console.error("Email verification error:", error.response?.data);

        toast.error(
          error.response?.data?.message ||
            "Token invalid or expired. Please resend verification."
        );
        router.push("/resend-verification");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0E8E8]">
      {loading ? (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Verifying your email...
          </h2>
          <p className="text-gray-600">Please wait a moment.</p>
        </>
      ) : (
        <h2 className="text-xl font-semibold text-red-500">
          Verification process finished.
        </h2>
      )}
    </div>
  );
};

export default VerifyEmailPage;
