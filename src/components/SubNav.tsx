"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, Sparkles } from "lucide-react";
import { DEPARTMENTS } from "@/lib/mockData";

export const SubNav: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <nav className="bg-amazon-subnav text-white text-xs px-2 sm:px-4 py-1.5 flex items-center gap-4 overflow-x-auto no-scrollbar shadow-inner select-none">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded font-bold transition shrink-0"
        >
          <Menu className="h-4 w-4" />
          <span>All</span>
        </button>

        <Link
          href="/s?deal=true"
          className="px-2 py-1 border border-transparent hover:border-white rounded text-amazon-yellow font-bold hover:underline transition shrink-0 flex items-center gap-1"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Today&apos;s Deals</span>
        </Link>

        {DEPARTMENTS.map((dept) => (
          <Link
            key={dept}
            href={`/category/${dept.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
            className="px-2 py-1 border border-transparent hover:border-white rounded hover:underline transition shrink-0 whitespace-nowrap"
          >
            {dept}
          </Link>
        ))}

        <Link
          href="/contact"
          className="px-2 py-1 border border-transparent hover:border-white rounded hover:underline transition shrink-0 hidden md:inline"
        >
          Customer Service
        </Link>

        <Link
          href="/faq"
          className="px-2 py-1 border border-transparent hover:border-white rounded hover:underline transition shrink-0 hidden lg:inline"
        >
          Registry &amp; Help
        </Link>
      </nav>

      {/* Hamburger Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 animate-in fade-in transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative w-80 max-w-[80vw] bg-white text-gray-800 h-full overflow-y-auto shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="bg-amazon-subnav text-white p-4 flex items-center justify-between">
              <span className="font-bold text-sm flex items-center gap-2">
                Hello, Browse Amazon
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-300 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Department Categories */}
            <div className="p-4 space-y-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-gray-900 text-xs uppercase tracking-wider pb-2 border-b border-gray-200">
                  Shop by Department
                </p>
                {DEPARTMENTS.map((dept) => (
                  <Link
                    key={dept}
                    href={`/category/${dept.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between py-2 text-gray-700 hover:text-amazon-orange hover:bg-gray-50 px-2 rounded transition"
                  >
                    <span>{dept}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                  </Link>
                ))}
              </div>

              <div className="space-y-1 pt-2 border-t border-gray-200">
                <p className="font-bold text-gray-900 text-xs uppercase tracking-wider pb-2">
                  Help &amp; Settings
                </p>
                <Link
                  href="/account"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block py-2 text-gray-700 hover:text-amazon-orange px-2"
                >
                  Your Account
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block py-2 text-gray-700 hover:text-amazon-orange px-2"
                >
                  Your Orders
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block py-2 text-gray-700 hover:text-amazon-orange px-2"
                >
                  Customer Support
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block py-2 text-gray-700 hover:text-amazon-orange px-2"
                >
                  FAQ &amp; Return Policies
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
