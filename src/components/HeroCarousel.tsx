"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UI_CONFIG } from "@/lib/uiDefects";

const SLIDES = [
  {
    id: 1,
    title: "Big Savings on Electronics & Gadgets",
    subtitle: "Noise cancelling headphones, 4K displays, and premium gaming gear",
    cta: "Shop Electronics",
    link: "/category/electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80",
  },
  {
    id: 2,
    title: "Fall & Winter Fashion Collections",
    subtitle: "Denim jackets, performance footwear, and stylish weatherwear",
    cta: "Explore Fashion",
    link: "/category/fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80",
  },
  {
    id: 3,
    title: "Kitchen & Home Essentials Up to 40% Off",
    subtitle: "Espresso machines, air fryers, and stainless steel cookware sets",
    cta: "Shop Home",
    link: "/category/home-kitchen",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80",
  },
  {
    id: 4,
    title: "Best-Selling Reads & Software Engineering Guides",
    subtitle: "Atomic Habits, Clean Code, System Design, and Project Hail Mary",
    cta: "Discover Books",
    link: "/category/books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&q=80",
  },
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (!UI_CONFIG.enableCarouselForwardNav) {
      return;
    }
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-out h-[260px] sm:h-[350px] md:h-[450px]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div
            key={slide.id}
            className="w-full shrink-0 relative h-full flex items-center"
          >
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amazon-bg via-transparent to-black/40" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 sm:px-12 w-full text-white pb-20">
              <span className="inline-block bg-amazon-orange text-amazon-text font-black text-xs px-2.5 py-1 rounded mb-3 tracking-wide uppercase">
                Featured Deal
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold max-w-2xl drop-shadow-md leading-tight">
                {slide.title}
              </h2>
              <p className="mt-2 text-sm sm:text-base max-w-xl text-gray-200 drop-shadow">
                {slide.subtitle}
              </p>
              <div className="mt-4">
                <Link
                  href={slide.link}
                  className="inline-block rounded-md bg-amazon-yellow hover:bg-amazon-yellowHover text-amazon-text font-bold px-6 py-2.5 text-xs sm:text-sm shadow-md transition"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/3 -translate-y-1/2 p-2 rounded border border-transparent hover:border-white focus:outline-none focus:ring-2 focus:ring-amazon-orange bg-black/30 hover:bg-black/60 text-white transition z-10"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/3 -translate-y-1/2 p-2 rounded border border-transparent hover:border-white focus:outline-none focus:ring-2 focus:ring-amazon-orange bg-black/30 hover:bg-black/60 text-white transition z-10"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all ${
              currentSlide === idx ? "w-8 bg-amazon-orange" : "w-2.5 bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
