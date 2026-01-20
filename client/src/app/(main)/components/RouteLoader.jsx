"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "./Loader";

export default function RouteLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    window.addEventListener("beforeunload", start);
    router.events?.on("routeChangeStart", start);
    router.events?.on("routeChangeComplete", end);
    router.events?.on("routeChangeError", end);

    return () => {
      window.removeEventListener("beforeunload", start);
      router.events?.off("routeChangeStart", start);
      router.events?.off("routeChangeComplete", end);
      router.events?.off("routeChangeError", end);
    };
  }, [router]);

  return loading && <Loader />;
}
