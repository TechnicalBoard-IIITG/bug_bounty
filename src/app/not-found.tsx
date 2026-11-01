"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TreasureCelebrationModal } from "@/components/TreasureCelebrationModal";

export default function NotFound() {
  const [clickCount, setClickCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDogClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount >= 3) {
      setIsModalOpen(true);
      setClickCount(0);
    }
  };

  return (
    <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center px-4 py-16 text-amazon-text text-center space-y-6">
      {/* Dogs of Amazon Photo - 3-Click Treasure Trigger */}
      <div
        onClick={handleDogClick}
        className="max-w-xs overflow-hidden rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition group relative select-none"
        title="Rufus, the legendary Amazon office dog (Click to inspect)"
      >
        <img
          src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80"
          alt="Dogs of Amazon - Rufus"
          className="w-full h-56 object-cover group-hover:scale-105 transition duration-200"
        />
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
          🐾 Rufus {clickCount > 0 && `(${clickCount}/3)`}
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          Looking for something?
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          We&apos;re sorry. The Web address you entered is not a functioning page on our site.
        </p>
        <p
          onClick={handleDogClick}
          className="text-xs text-amazon-link font-semibold pt-1 cursor-pointer hover:underline select-none"
        >
          MEET THE DOGS OF AMAZON &bull; RUFUS
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/"
          className="rounded-md bg-amazon-yellow hover:bg-amazon-yellowHover px-6 py-2 text-xs font-bold text-amazon-text shadow-sm transition"
        >
          Go to Amazon.com&apos;s Home Page
        </Link>
        <Link
          href="/faq"
          className="rounded-md border border-gray-300 hover:bg-gray-100 px-6 py-2 text-xs font-semibold text-gray-700 transition"
        >
          Help & Customer Service
        </Link>
      </div>

      <TreasureCelebrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="MEET THE DOGS OF AMAZON!"
        subtitle="Woof! You found Rufus, the legendary Amazon office dog!"
        treasureCode="TREASURE-LOST-PUPPY"
      />
    </div>
  );
}
