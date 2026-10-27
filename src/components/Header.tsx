"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  Sun,
  Moon,
  User as UserIcon,
} from "lucide-react";
import { isDefectActive } from "@/config/defects.config";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { LocationModal } from "./LocationModal";

const CATEGORIES = ["All", "Electronics", "Fashion", "Home & Kitchen", "Books"];

const AUTOCOMPLETE_SUGGESTIONS: Record<string, string[]> = {
  head: ["headphones wireless", "headphones with microphone", "headphone stand", "headset gaming"],
  air: ["air fryer", "air purifiers for home", "airpods pro", "air fryer liners"],
  book: ["books best sellers", "books self help", "book light", "bookmarks"],
  jean: ["jeans for men", "jeans for women", "jean jacket blue", "jean shorts"],
  coff: ["coffee maker", "coffee grinder", "coffee table", "coffee beans"],
  oled: ["oled 4k tv", "oled monitor 144hz", "oled switch", "oled 55 inch"],
  shoe: ["shoes for men", "shoes running", "shoes sneakers", "shoe rack"],
  came: ["camera digital", "camera tripod", "camera backpack", "camera 4k"],
};

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const currency = useCartStore((s) => s.currency);
  const setCurrency = useCartStore((s) => s.setCurrency);
  const reactiveCartCount = useCartStore((s) => s.getItemCount());

  // Location Modal State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [zipCode, setZipCode] = useState("98109");

  // Search State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Account Dropdown State
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  // EASY_02: Theme Toggle Visual Inconsistency
  const [isDarkIcon, setIsDarkIcon] = useState(false);

  const toggleTheme = () => {
    const nextDark = !isDarkIcon;
    setIsDarkIcon(nextDark);

    // EASY_02: If defect active, icon toggles but CSS color classes and background remain unchanged
    if (!isDefectActive("EASY_02_THEME_TOGGLE_INCONSISTENCY")) {
      if (nextDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // EASY_03: Reactive Cart Badge Counter
  // When defect is active: Header badge counter remains at initial mount state (0)
  // and fails to reactively update until page reload
  const [frozenCartCount, setFrozenCartCount] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // On initial mount, capture cart count
    try {
      const stored = localStorage.getItem("amazon_replica_cart_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        const count = parsed?.state?.items?.reduce((acc: number, it: { quantity: number }) => acc + (it.quantity || 1), 0) || 0;
        setFrozenCartCount(count);
      }
    } catch {
      setFrozenCartCount(0);
    }
  }, []);

  const displayedCartCount = isDefectActive("EASY_03_REACTIVE_CART_BADGE")
    ? frozenCartCount
    : isMounted
    ? reactiveCartCount
    : 0;

  // Search autocomplete logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matched = Object.keys(AUTOCOMPLETE_SUGGESTIONS).find((prefix) => q.startsWith(prefix));
    if (matched) {
      setSuggestions(AUTOCOMPLETE_SUGGESTIONS[matched]);
    } else {
      setSuggestions([
        `${searchQuery} in ${selectedCategory}`,
        `${searchQuery} best deals`,
        `${searchQuery} prime eligible`,
      ]);
    }
  }, [searchQuery, selectedCategory]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);
    router.push(`/s?${params.toString()}`);
  };

  // EASY_01: Top Navbar Logo Routing
  // When active: Brand logo routes to /about instead of /
  const logoHref = isDefectActive("EASY_01_NAVBAR_LOGO_ROUTING") ? "/about" : "/";

  return (
    <header className="bg-amazon-nav text-white select-none sticky top-0 z-40">
      {/* Top Main Nav */}
      <div className="flex items-center justify-between px-3 py-1.5 gap-2 md:gap-4 text-xs">
        {/* Amazon Logo with EASY_01 routing defect */}
        <Link
          href={logoHref}
          className="flex items-center p-1.5 border border-transparent hover:border-white rounded cursor-pointer transition shrink-0"
          title="Amazon Home"
        >
          <div className="flex items-baseline font-black tracking-tight text-white text-xl md:text-2xl">
            amazon<span className="text-amazon-orange text-xs md:text-sm font-semibold">.com</span>
          </div>
        </Link>

        {/* Deliver To Location */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="hidden lg:flex items-center p-1.5 border border-transparent hover:border-white rounded text-left transition shrink-0"
        >
          <MapPin className="h-4 w-4 text-gray-300 mr-1 mt-2" />
          <div>
            <div className="text-[11px] text-gray-300 leading-tight">Deliver to</div>
            <div className="text-[13px] font-bold text-white leading-tight">Seattle {zipCode}</div>
          </div>
        </button>

        {/* Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-3xl">
          <form onSubmit={handleSearchSubmit} className="flex h-10 w-full rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-amazon-orange">
            {/* Category Dropdown */}
            <div className="relative bg-gray-100 hover:bg-gray-200 text-amazon-text flex items-center border-r border-gray-300">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-full bg-transparent pl-2.5 pr-6 text-xs text-gray-700 cursor-pointer focus:outline-none appearance-none font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3 w-3 text-gray-600 absolute right-1.5 pointer-events-none" />
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search Amazon"
              className="flex-1 px-3 text-sm text-amazon-text bg-white focus:outline-none"
            />

            {/* Search Button */}
            <button
              type="submit"
              className="bg-amazon-accent hover:bg-amazon-yellow text-amazon-text px-4 flex items-center justify-center transition"
              aria-label="Search"
            >
              <Search className="h-5 w-5 stroke-[2.5]" />
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-0.5 bg-white text-amazon-text rounded-b-md shadow-xl border border-gray-200 z-50 overflow-hidden">
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSearchQuery(item);
                    setShowSuggestions(false);
                    const params = new URLSearchParams();
                    params.set("q", item);
                    if (selectedCategory !== "All") params.set("category", selectedCategory);
                    router.push(`/s?${params.toString()}`);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs font-semibold text-gray-800"
                >
                  <Search className="h-3.5 w-3.5 text-gray-400 mr-2.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Currency Switcher */}
        <div className="hidden sm:flex items-center p-1.5 border border-transparent hover:border-white rounded transition">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "USD" | "CAD" | "EUR")}
            className="bg-transparent text-white font-bold text-xs cursor-pointer focus:outline-none"
          >
            <option value="USD" className="text-black">EN - $ USD</option>
            <option value="CAD" className="text-black">EN - CA$ CAD</option>
            <option value="EUR" className="text-black">EN - € EUR</option>
          </select>
        </div>

        {/* EASY_02 Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-1.5 border border-transparent hover:border-white rounded text-gray-300 hover:text-white transition flex items-center"
          title="Toggle Theme"
        >
          {isDarkIcon ? <Sun className="h-4 w-4 text-amazon-yellow" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Account & Lists */}
        <div
          className="relative"
          onMouseEnter={() => setIsAccountMenuOpen(true)}
          onMouseLeave={() => setIsAccountMenuOpen(false)}
        >
          <Link
            href={user ? "/account" : "/login"}
            className="flex flex-col p-1.5 border border-transparent hover:border-white rounded text-left transition"
          >
            <span className="text-[11px] text-gray-300 leading-tight">
              Hello, {user ? user.name.split(" ")[0] : "sign in"}
            </span>
            <span className="text-[13px] font-bold text-white flex items-center leading-tight">
              Account & Lists
              <ChevronDown className="h-3 w-3 ml-0.5 text-gray-400" />
            </span>
          </Link>

          {/* Account Dropdown */}
          {isAccountMenuOpen && (
            <div className="absolute right-0 top-full mt-0 w-64 rounded-md bg-white p-4 shadow-2xl border border-gray-200 text-amazon-text z-50">
              {!user ? (
                <div className="border-b pb-3 mb-3 text-center">
                  <Link
                    href="/login"
                    className="block w-full rounded bg-amazon-yellow hover:bg-amazon-yellowHover py-1.5 text-center text-xs font-bold shadow-sm"
                  >
                    Sign in
                  </Link>
                  <p className="mt-2 text-[11px] text-gray-600">
                    New customer?{" "}
                    <Link href="/register" className="text-amazon-link hover:underline">
                      Start here.
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="border-b pb-2 mb-2">
                  <p className="text-xs font-bold text-gray-900">{user.name}</p>
                  <p className="text-[11px] text-gray-500">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold bg-gray-200 px-1.5 py-0.5 rounded uppercase">
                    {user.role}
                  </span>
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-1">
                  Your Account
                </div>
                <Link href="/account" className="block text-gray-700 hover:text-amazon-orange">
                  Your Account
                </Link>
                <Link href="/orders" className="block text-gray-700 hover:text-amazon-orange">
                  Your Orders
                </Link>
                <Link href="/account/addresses" className="block text-gray-700 hover:text-amazon-orange">
                  Your Addresses
                </Link>
                <Link href="/account/profile" className="block text-gray-700 hover:text-amazon-orange">
                  Profile & Avatar
                </Link>

                {/* Direct link to admin console for Hard 3 test */}
                <Link href="/admin/users" className="block text-gray-500 hover:text-amazon-orange text-[11px] pt-1">
                  Admin User Console
                </Link>

                {user && (
                  <button
                    onClick={() => logout()}
                    className="w-full text-left pt-2 text-xs text-red-600 hover:underline border-t mt-2"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Returns & Orders */}
        <Link
          href="/orders"
          className="hidden md:flex flex-col p-1.5 border border-transparent hover:border-white rounded text-left transition shrink-0"
        >
          <span className="text-[11px] text-gray-300 leading-tight">Returns</span>
          <span className="text-[13px] font-bold text-white leading-tight">& Orders</span>
        </Link>

        {/* Cart Button with EASY_03 non-reactive defect */}
        <Link
          href="/cart"
          className="flex items-center p-1.5 border border-transparent hover:border-white rounded transition shrink-0 relative"
          title="Shopping Cart"
        >
          <div className="relative flex items-center">
            <ShoppingCart className="h-8 w-8 text-white" />
            <span
              className={`absolute -top-1 left-4 font-bold rounded-full text-center px-1 text-xs ${
                displayedCartCount > 0 ? "text-amazon-orange font-black" : "text-white"
              }`}
            >
              {displayedCartCount}
            </span>
          </div>
          <span className="hidden sm:inline font-bold text-[13px] ml-1 mt-3">Cart</span>
        </Link>
      </div>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentZip={zipCode}
        onSaveZip={(newZip) => setZipCode(newZip)}
      />
    </header>
  );
};
