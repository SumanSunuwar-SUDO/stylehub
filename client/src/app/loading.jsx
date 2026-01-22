import React from "react";
import Loader from "./(main)/components/Loader";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F0E8E8]">
      <Loader />
    </div>
  );
}
