"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import TextType from "./TextType";
import Magnet from "./Magnet";
import Forward from "@/UI/Forward";

// Fallback icon
let ForwardIcon;
try {
  ForwardIcon = require("@/UI/Forward").default;
} catch (e) {
  ForwardIcon = () => <>→</>;
}

// Original images
const images = [
  "/images/bg1.png",
  "/images/bg2.jpg",
  "/images/bg3.png",
  "/images/bg5.png",
  "/images/bg6.png",
];

// Clone first slide at the end for smooth infinite forward sliding
const slides = [...images, images[0]];
const SLIDE_INTERVAL = 3000; // 3 seconds per slide
const TRANSITION_DURATION = 1000; // match CSS transition duration (ms)

export default function Hero() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true); // control CSS transition

  // Go to next slide (infinite forward)
  const nextSlide = useCallback(() => {
    setCurrent((prev) => prev + 1);
    setIsTransitioning(true);
  }, []);

  // Go to specific slide via dots
  const goToSlide = useCallback((index) => {
    setCurrent(index);
    setIsTransitioning(true);
  }, []);

  // Auto slide interval
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  // Reset to real first slide instantly when reaching cloned slide
  useEffect(() => {
    if (current === slides.length - 1) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false); // remove transition for instant jump
        setCurrent(0); // jump to real first slide
      }, TRANSITION_DURATION);
      return () => clearTimeout(timeout);
    } else {
      setIsTransitioning(true);
    }
  }, [current]);

  // Preload next image
  useEffect(() => {
    const nextIndex = (current + 1) % slides.length;
    const img = new window.Image();
    img.src = slides[nextIndex];
  }, [current]);

  const handleExploreClick = useCallback(() => {
    toast.info("Redirecting to products...");
    router.push("/products");
  }, [router]);

  return (
    <div
      className="relative h-[calc(100vh-70px)] w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sliding Container */}
      <div
        className={`flex h-full ${
          isTransitioning ? "transition-transform duration-1000 ease-out" : ""
        }`}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((img, index) => (
          <div key={index} className="relative h-full w-full shrink-0">
            <Image
              src={img}
              alt={`Hero background ${index + 1}`}
              fill
              priority={index === 0}
              quality={85}
              sizes="100vw"
              className="object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          Welcome to <span className="text-[#E67514]">StyleHub</span>
        </h1>

        {/* Typing Text */}
        <div className="text-2xl md:text-5xl text-shadow-white font-bold mb-3">
          <TextType
            text={[
              "Simple Styles. Remarkable You.",
              "Effortless Fashion for Everyday Life",
              "Wear What Feels Right",
              "Minimal Look, Maximum Impact",
            ]}
            typingSpeed={165}
            pauseDuration={3000}
            showCursor
            cursorCharacter="_"
            deletingSpeed={100}
            cursorBlinkDuration={0.5}
          />
        </div>

        <p className="mb-8 max-w-2xl text-lg text-gray-200 md:text-xl">
          Fashion that fits your lifestyle — modern, comfortable, and made for
          everyday confidence.
        </p>

        <button
          onClick={handleExploreClick}
          className="group flex items-center gap-2 rounded-full bg-white hover:bg-[#E67514] px-8 py-4 text-lg font-semibold text-black transition-all hover:scale-105 hover:shadow-2xl active:scale-95 duration-300"
          aria-label="Explore products"
        >
          {" "}
          <Magnet padding={210} magnetStrength={9}>
            <div className="flex items-center gap-2">
              <p>Explore Products </p>

              <span>
                <Forward />
              </span>
            </div>
          </Magnet>
        </button>
      </div>

      {/* Dots Navigation */}
      <div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3"
        role="tablist"
        aria-label="Slideshow navigation"
      >
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current % images.length ? "true" : "false"}
            className={`h-2 w-3 rounded-full transition-all duration-300 ${
              index === current % images.length
                ? "bg-white scale-125"
                : "bg-gray-300 hover:bg-gray-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
