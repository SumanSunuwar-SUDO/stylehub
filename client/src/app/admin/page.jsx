"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Loader from "../(main)/components/Loader";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/admin/dashboard");
  }, []);
  return (
    <div>
      <Loader />
    </div>
  );
};

export default page;
