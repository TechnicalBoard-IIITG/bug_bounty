import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center px-4 py-16 text-amazon-text text-center space-y-6">
      {/* Dogs of Amazon Photo */}
      <div className="max-w-xs overflow-hidden rounded-lg shadow-md border border-gray-200">
        <img
          src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80"
          alt="Dogs of Amazon"
          className="w-full h-56 object-cover"
        />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          Looking for something?
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          We&apos;re sorry. The Web address you entered is not a functioning page on our site.
        </p>
        <p className="text-xs text-amazon-link font-semibold pt-1">
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
    </div>
  );
}
