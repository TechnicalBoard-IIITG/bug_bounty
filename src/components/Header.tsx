"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  MapPin,
  Moon,
  Sun,
  User,
  LogOut,
  Package,
  MapPinned,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { UI_CONFIG } from "@/lib/uiDefects";

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const currency = useCartStore((s) => s.currency);
  const setCurrency = useCartStore((s) => s.setCurrency);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDark, setIsDark] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push("/s");
      return;
    }
    const params = new URLSearchParams();
    params.set("q", searchQuery.trim());
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    router.push(`/s?${params.toString()}`);
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
    if (UI_CONFIG.enableThemeDocumentSync) {
      document.documentElement.classList.toggle("dark");
    }
  };

  // EASY_03: Header badge counter remains at initial mount state (0)
  const displayedCartCount = 0;

  return (
    <header className="sticky top-0 z-40 bg-[#131921] text-white text-xs select-none shadow-md">
      {/* Top Navbar */}
      <div className="w-full px-2 sm:px-4 h-[60px] flex items-center gap-2 sm:gap-4">
        {/* Amazon Logo with signature smile curve + EASY_01 routing */}
        <Link
          href={UI_CONFIG.brandLogoHref}
          className="flex items-center px-2 py-1.5 border border-transparent hover:border-white rounded-sm cursor-pointer transition shrink-0"
        >
          <div className="flex flex-col items-start leading-none pt-1">
            <div className="flex items-baseline">
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-white">
                amazon
              </span>
              <span className="text-[11px] text-[#febd69] font-bold ml-0.5">.com</span>
            </div>
            {/* Amazon iconic curved smile arrow */}
            <svg
              className="w-[74px] h-[10px] text-[#ff9900] -mt-0.5"
              viewBox="0 0 100 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 5 6 Q 50 20 95 6"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 87 2 L 96 6 L 90 14 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </Link>

        {/* Deliver to Location */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1.5 border border-transparent hover:border-white rounded-sm cursor-pointer transition shrink-0">
          <MapPin className="h-4 w-4 text-white shrink-0 mt-2" />
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-[#ccc]">Deliver to</span>
            <span className="font-bold text-white text-xs">Seattle 98109</span>
          </div>
        </div>

        {/* Amazon High-Contrast Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 flex items-center h-10 rounded focus-within:ring-2 focus-within:ring-[#f3a847] overflow-hidden bg-white shadow-sm"
        >
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-full bg-[#f3f3f3] text-gray-700 px-3 text-xs border-r border-[#cdcdcd] focus:outline-none hover:bg-[#e2e2e2] cursor-pointer hidden md:block"
          >
            <option value="all">All Departments</option>
            <option value="Electronics">Electronics</option>
            <option value="Computers">Computers</option>
            <option value="Fashion">Fashion</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Books">Books</option>
            <option value="Beauty & Health">Beauty & Health</option>
          </select>

          <input
            type="text"
            placeholder="Search Amazon"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-full px-3 text-gray-900 text-sm focus:outline-none placeholder-gray-500"
          />

          <button
            type="submit"
            className="h-full px-4 sm:px-5 bg-[#febd69] hover:bg-[#f3a847] text-gray-900 flex items-center justify-center transition cursor-pointer"
          >
            <Search className="h-5 w-5 text-gray-800" />
          </button>
        </form>

        {/* Language & Currency Selector */}
        <div className="hidden sm:flex items-center gap-1 px-2 py-1.5 border border-transparent hover:border-white rounded-sm cursor-pointer transition shrink-0">
          <span className="text-sm">🇺🇸</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as any)}
            className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="USD" className="text-gray-900 font-normal">EN - $ USD</option>
            <option value="CAD" className="text-gray-900 font-normal">CA - $ CAD</option>
            <option value="EUR" className="text-gray-900 font-normal">EU - € EUR</option>
          </select>
        </div>

        {/* EASY_02 Theme Switcher */}
        <button
          onClick={handleThemeToggle}
          title="Toggle Dark / Light Theme"
          className="p-1.5 border border-transparent hover:border-white rounded-sm text-gray-300 hover:text-white transition"
        >
          {isDark ? <Sun className="h-4 w-4 text-amazon-yellow" /> : <Moon className="h-4 w-4 text-gray-300" />}
        </button>

        {/* Account & Lists */}
        <div
          className="relative px-2 py-1.5 border border-transparent hover:border-white rounded-sm cursor-pointer transition shrink-0"
          onMouseEnter={() => setIsAccountMenuOpen(true)}
          onMouseLeave={() => setIsAccountMenuOpen(false)}
        >
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-[#ccc] truncate max-w-[100px]">
              {user ? `Hello, ${user.name}` : "Hello, sign in"}
            </span>
            <span className="font-bold text-white text-xs flex items-center gap-0.5">
              Account &amp; Lists <ChevronDown className="h-3 w-3 text-gray-300" />
            </span>
          </div>

          {/* Account Dropdown */}
          {isAccountMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-white text-gray-800 rounded shadow-2xl border border-gray-200 p-4 z-50 animate-in fade-in duration-150">
              {user ? (
                <div className="space-y-3 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-amazon-orange" />
                    <div>
                      <p className="font-bold text-xs text-gray-900">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="w-full text-center py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pb-3 border-b border-gray-200 text-center space-y-2">
                  <Link
                    href="/login"
                    className="block w-full py-2 bg-[#ffd814] hover:bg-[#f7ca00] rounded text-xs font-bold text-gray-900 shadow-sm"
                  >
                    Sign in
                  </Link>
                  <p className="text-[11px] text-gray-600">
                    New customer?{" "}
                    <Link href="/register" className="text-amazon-link hover:underline font-semibold">
                      Start here.
                    </Link>
                  </p>
                </div>
              )}

              <div className="pt-3 space-y-2 text-xs">
                <p className="font-bold text-gray-900 text-[11px] uppercase tracking-wider">Your Account</p>
                <Link href="/account" className="block text-gray-700 hover:text-amazon-orange hover:underline">
                  Your Account
                </Link>
                <Link href="/orders" className="block text-gray-700 hover:text-amazon-orange hover:underline">
                  Your Orders
                </Link>
                <Link href="/account/addresses" className="block text-gray-700 hover:text-amazon-orange hover:underline">
                  Your Addresses
                </Link>
                <Link href="/account/profile" className="block text-gray-700 hover:text-amazon-orange hover:underline">
                  Profile &amp; Settings
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Returns & Orders */}
        <Link
          href="/orders"
          className="hidden md:flex flex-col leading-tight px-2 py-1.5 border border-transparent hover:border-white rounded-sm cursor-pointer transition shrink-0"
        >
          <span className="text-[11px] text-[#ccc]">Returns</span>
          <span className="font-bold text-white text-xs">&amp; Orders</span>
        </Link>

        {/* Cart Button with EASY_03 non-reactive counter */}
        <Link
          href="/cart"
          className="flex items-end px-2 py-1.5 border border-transparent hover:border-white rounded-sm cursor-pointer transition shrink-0 relative"
        >
          <div className="relative">
            <span className="absolute -top-1.5 left-3 text-[#f08804] font-bold text-sm">
              {displayedCartCount}
            </span>
            <ShoppingCart className="h-7 w-7 text-white" />
          </div>
          <span className="font-bold text-white text-xs hidden sm:inline ml-1 mb-0.5">Cart</span>
        </Link>
      </div>
    </header>
  );
};
