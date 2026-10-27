"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";

export const SubNav: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <nav className="bg-amazon-subnav text-white text-xs px-3 py-1.5 flex items-center gap-4 overflow-x-auto select-none border-b border-gray-800">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-1 font-bold p-1 hover:border hover:border-white rounded transition shrink-0"
        >
          <Menu className="h-4 w-4" />
          <span>All</span>
        </button>

        <Link
          href="/s?q=deals"
          className="p-1 hover:border hover:border-white rounded transition whitespace-nowrap"
        >
          Today&apos;s Deals
        </Link>
        <Link
          href="/faq"
          className="p-1 hover:border hover:border-white rounded transition whitespace-nowrap"
        >
          Customer Service
        </Link>
        <Link
          href="/category/electronics"
          className="p-1 hover:border hover:border-white rounded transition whitespace-nowrap"
        >
          Electronics
        </Link>
        <Link
          href="/category/fashion"
          className="p-1 hover:border hover:border-white rounded transition whitespace-nowrap"
        >
          Fashion
        </Link>
        <Link
          href="/category/home-kitchen"
          className="p-1 hover:border hover:border-white rounded transition whitespace-nowrap"
        >
          Home & Kitchen
        </Link>
        <Link
          href="/category/books"
          className="p-1 hover:border hover:border-white rounded transition whitespace-nowrap"
        >
          Books
        </Link>
        <Link
          href="/contact"
          className="p-1 hover:border hover:border-white rounded transition whitespace-nowrap"
        >
          Contact Us
        </Link>
      </nav>

      {/* Hamburger Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 animate-in fade-in"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 text-amazon-text overflow-y-auto">
            {/* Header */}
            <div className="bg-amazon-subnav text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base">
                <span className="text-xl">Hello, Sign in</span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-white hover:text-gray-300 p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Menu List */}
            <div className="p-4 space-y-6 text-sm">
              <div>
                <h4 className="font-bold text-gray-900 text-base mb-2">Shop by Department</h4>
                <div className="space-y-1">
                  <Link
                    href="/category/electronics"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between py-2.5 px-2 hover:bg-gray-100 rounded text-gray-700 font-medium"
                  >
                    <span>Electronics & Gadgets</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link
                    href="/category/fashion"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between py-2.5 px-2 hover:bg-gray-100 rounded text-gray-700 font-medium"
                  >
                    <span>Clothing & Fashion</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link
                    href="/category/home-kitchen"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between py-2.5 px-2 hover:bg-gray-100 rounded text-gray-700 font-medium"
                  >
                    <span>Home & Kitchen</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link
                    href="/category/books"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between py-2.5 px-2 hover:bg-gray-100 rounded text-gray-700 font-medium"
                  >
                    <span>Books & Audible</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 text-base mb-2">Help & Settings</h4>
                <div className="space-y-1">
                  <Link
                    href="/account"
                    onClick={() => setIsDrawerOpen(false)}
                    className="block py-2 px-2 hover:bg-gray-100 rounded text-gray-700"
                  >
                    Your Account
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setIsDrawerOpen(false)}
                    className="block py-2 px-2 hover:bg-gray-100 rounded text-gray-700"
                  >
                    Your Orders
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setIsDrawerOpen(false)}
                    className="block py-2 px-2 hover:bg-gray-100 rounded text-gray-700"
                  >
                    Customer Service FAQ
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsDrawerOpen(false)}
                    className="block py-2 px-2 hover:bg-gray-100 rounded text-gray-700"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
