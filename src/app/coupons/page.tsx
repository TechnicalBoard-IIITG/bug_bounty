"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Star, Check, Scissors, Tag, ChevronRight, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { CURRENCY_SYMBOLS, CURRENCY_RATES } from "@/lib/utils";

interface CouponProduct {
  id: string;
  productId: string;
  title: string;
  brand: string;
  department: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  couponCode: string;
  discountPercent: number;
  terms: string;
}

const COUPON_CATALOG: CouponProduct[] = [
  // Electronics
  {
    id: "coup-1",
    productId: "prod-e06",
    title: "Anker 65W GaN Fast Charger 3-Port Compact Foldable Wall Adapter",
    brand: "Anker",
    department: "Electronics",
    price: 39.99,
    mrp: 49.99,
    rating: 4.8,
    reviewCount: 3820,
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80",
    couponCode: "ENTROPY2K26",
    discountPercent: 20,
    terms: "Save 20% with coupon. Discount applies at checkout. One redemption per account.",
  },
  {
    id: "coup-2",
    productId: "prod-e01",
    title: "Sony WH-1000XM5 Wireless Noise-Canceling Over-Ear Headphones",
    brand: "Sony",
    department: "Electronics",
    price: 348.0,
    mrp: 399.99,
    rating: 4.8,
    reviewCount: 1420,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    couponCode: "CASHBACK15",
    discountPercent: 15,
    terms: "Save 15% with coupon. Instant discount on premium audio gear.",
  },

  // Computers
  {
    id: "coup-3",
    productId: "prod-c01",
    title: "Apple MacBook Pro 14-inch M3 Chip (16GB RAM, 512GB SSD)",
    brand: "Apple",
    department: "Computers",
    price: 1599.0,
    mrp: 1799.0,
    rating: 4.9,
    reviewCount: 980,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    couponCode: "WELCOME10",
    discountPercent: 10,
    terms: "Save 10% with coupon. Eligible for verified student & business accounts.",
  },
  {
    id: "coup-4",
    productId: "prod-c02",
    title: "Logitech MX Master 3S Wireless Performance Ergonomic Mouse",
    brand: "Logitech",
    department: "Computers",
    price: 99.99,
    mrp: 119.99,
    rating: 4.7,
    reviewCount: 4120,
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
    couponCode: "MEGA25",
    discountPercent: 25,
    terms: "Save 25% with coupon. Professional workstation hardware promotion.",
  },

  // Fashion
  {
    id: "coup-5",
    productId: "prod-f01",
    title: "Levi's Men's Original Trucker Denim Jacket, Rugged Indigo",
    brand: "Levi's",
    department: "Fashion",
    price: 79.5,
    mrp: 98.0,
    rating: 4.6,
    reviewCount: 840,
    imageUrl: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    couponCode: "HOLIDAY30",
    discountPercent: 30,
    terms: "Save 30% with coupon. Season special apparel savings.",
  },
  {
    id: "coup-6",
    productId: "prod-f02",
    title: "Nike Air Max 270 Men's Breathable Athletic Running Sneakers",
    brand: "Nike",
    department: "Fashion",
    price: 139.99,
    mrp: 160.0,
    rating: 4.7,
    reviewCount: 2210,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    couponCode: "FESTIVE20",
    discountPercent: 20,
    terms: "Save 20% with coupon. Valid on select sizes and colorways.",
  },

  // Home & Kitchen
  {
    id: "coup-7",
    productId: "prod-h01",
    title: "Nespresso Vertuo Pop+ Coffee & Espresso Machine by De'Longhi",
    brand: "Nespresso",
    department: "Home & Kitchen",
    price: 119.0,
    mrp: 149.0,
    rating: 4.6,
    reviewCount: 1640,
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
    couponCode: "APPEXCLUSIVE",
    discountPercent: 15,
    terms: "Save 15% with coupon. Includes complimentary tasting coffee capsule pack.",
  },
  {
    id: "coup-8",
    productId: "prod-h02",
    title: "Dyson V12 Detect Slim Cordless Vacuum Cleaner with Laser illumination",
    brand: "Dyson",
    department: "Home & Kitchen",
    price: 499.0,
    mrp: 649.0,
    rating: 4.8,
    reviewCount: 1290,
    imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    couponCode: "FLAT50",
    discountPercent: 50,
    terms: "Save 50% with coupon. Limited quantity warehouse clearance event.",
  },

  // Beauty & Health
  {
    id: "coup-9",
    productId: "prod-bh01",
    title: "CeraVe Daily Moisturizing Lotion with Ceramides & Hyaluronic Acid",
    brand: "CeraVe",
    department: "Beauty & Health",
    price: 17.99,
    mrp: 22.99,
    rating: 4.9,
    reviewCount: 18450,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    couponCode: "DIWALI50",
    discountPercent: 50,
    terms: "Save 50% with coupon. Dermatologist recommended daily skincare essential.",
  },
  {
    id: "coup-10",
    productId: "prod-bh02",
    title: "Philips Sonicare ProtectiveClean 4100 Rechargeable Electric Toothbrush",
    brand: "Philips",
    department: "Beauty & Health",
    price: 49.96,
    mrp: 69.96,
    rating: 4.7,
    reviewCount: 5210,
    imageUrl: "https://images.unsplash.com/photo-1559591937-e1032d8471c9?w=800&q=80",
    couponCode: "PRIME100",
    discountPercent: 40,
    terms: "Save 40% with coupon. Pressure sensor alerts protect sensitive gums.",
  },

  // Books
  {
    id: "coup-11",
    productId: "prod-b01",
    title: "Amazon Kindle Paperwhite (16 GB) 6.8-inch Glare-Free Display",
    brand: "Amazon",
    department: "Books",
    price: 139.99,
    mrp: 149.99,
    rating: 4.8,
    reviewCount: 8900,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    couponCode: "SUPERDEAL",
    discountPercent: 35,
    terms: "Save 35% with coupon. Adjustable warm light with weeks of battery life.",
  },
  {
    id: "coup-12",
    productId: "prod-b02",
    title: "Atomic Habits by James Clear: Proven Ways to Build Good Habits (Hardcover)",
    brand: "Penguin",
    department: "Books",
    price: 14.99,
    mrp: 27.0,
    rating: 4.9,
    reviewCount: 42100,
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    couponCode: "SAVE10",
    discountPercent: 10,
    terms: "Save 10% with coupon. #1 New York Times best-seller multi-million copy phenomenon.",
  },
];

// ONLY include departments whose products are listed here!
const ACTIVE_DEPARTMENTS = [
  "All Coupons",
  "Electronics",
  "Computers",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Health",
  "Books",
];

export default function CouponsPage() {
  const [selectedDept, setSelectedDept] = useState("All Coupons");
  const [selectedDiscountFilter, setSelectedDiscountFilter] = useState<number | null>(null);
  const [clippedCoupons, setClippedCoupons] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currency = useCartStore((s) => s.currency);
  const symbol = CURRENCY_SYMBOLS[currency] || "₹";
  const rate = CURRENCY_RATES[currency] || 83.5;

  const handleClip = (coupon: CouponProduct) => {
    const isCurrentlyClipped = clippedCoupons[coupon.id];
    const nextState = !isCurrentlyClipped;

    setClippedCoupons((prev) => ({
      ...prev,
      [coupon.id]: nextState,
    }));

    if (nextState) {
      // Copy code to clipboard
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(coupon.couponCode).catch(() => {});
      }

      setToastMessage(
        `Coupon clipped! Code "${coupon.couponCode}" saved. Save ${coupon.discountPercent}% at checkout.`
      );
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const filteredProducts = useMemo(() => {
    return COUPON_CATALOG.filter((item) => {
      if (selectedDept !== "All Coupons" && item.department !== selectedDept) {
        return false;
      }
      if (selectedDiscountFilter !== null && item.discountPercent < selectedDiscountFilter) {
        return false;
      }
      return true;
    });
  }, [selectedDept, selectedDiscountFilter]);

  return (
    <div className="min-h-screen bg-[#eaeded] text-amazon-text">
      {/* 1. Deals & Coupons Sub-Navigation Bar (Authentic Amazon Deals Bar) */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-6 whitespace-nowrap">
            <Link href="/s?deal=true" className="text-gray-700 hover:text-amazon-orange transition">
              Today&apos;s Deals
            </Link>
            <span className="font-bold text-amazon-text border-b-2 border-amazon-orange pb-0.5">
              Coupons
            </span>
            <span className="text-gray-500 hover:text-gray-800 transition cursor-pointer">
              Renewed Deals
            </span>
            <span className="text-gray-500 hover:text-gray-800 transition cursor-pointer">
              Outlet
            </span>
            <span className="text-gray-500 hover:text-gray-800 transition cursor-pointer">
              Amazon Resale
            </span>
          </div>
          <span className="text-[11px] text-gray-500 hidden md:inline shrink-0">
            Terms &amp; conditions apply. Clip coupons to save automatically.
          </span>
        </div>
      </div>

      {/* 2. Department Filter Chips Carousel (Only departments with listed products) */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {ACTIVE_DEPARTMENTS.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isSelected
                    ? "bg-[#007185] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300/80"
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#067d62] text-white px-4 py-3 rounded shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <Check className="h-4 w-4 shrink-0 text-white" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:opacity-75"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 3. Main Body: Sidebar + Coupon Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Left Filter Sidebar */}
          <aside className="bg-white p-4 rounded border border-gray-200 shadow-2xs h-fit space-y-5 text-xs">
            {/* Filtered By Box */}
            <div>
              <span className="font-bold text-gray-900 block mb-2 text-sm">
                Filtered by
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-[11px] font-medium text-gray-700">
                  <span>Coupons</span>
                  <X className="h-3 w-3 text-gray-500" />
                </span>
                {selectedDept !== "All Coupons" && (
                  <button
                    onClick={() => setSelectedDept("All Coupons")}
                    className="inline-flex items-center gap-1 bg-amber-50 border border-amber-300 rounded px-2 py-0.5 text-[11px] font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    <span>{selectedDept}</span>
                    <X className="h-3 w-3" />
                  </button>
                )}
                {selectedDiscountFilter !== null && (
                  <button
                    onClick={() => setSelectedDiscountFilter(null)}
                    className="inline-flex items-center gap-1 bg-amber-50 border border-amber-300 rounded px-2 py-0.5 text-[11px] font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    <span>{selectedDiscountFilter}% off+</span>
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Department Checkboxes */}
            <div className="border-t border-gray-200 pt-4">
              <span className="font-bold text-gray-900 block mb-2 text-xs">
                Department
              </span>
              <ul className="space-y-1.5 text-gray-700">
                {ACTIVE_DEPARTMENTS.slice(1).map((dept) => {
                  const count = COUPON_CATALOG.filter((c) => c.department === dept).length;
                  const isChecked = selectedDept === dept;
                  return (
                    <li key={dept}>
                      <label className="flex items-center gap-2 cursor-pointer hover:text-amazon-link">
                        <input
                          type="radio"
                          name="deptRadio"
                          checked={isChecked}
                          onChange={() => setSelectedDept(isChecked ? "All Coupons" : dept)}
                          className="h-3.5 w-3.5 text-amazon-orange rounded border-gray-300 focus:ring-amazon-orange"
                        />
                        <span className="flex-1">{dept}</span>
                        <span className="text-gray-400 text-[11px]">({count})</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              {selectedDept !== "All Coupons" && (
                <button
                  onClick={() => setSelectedDept("All Coupons")}
                  className="text-[11px] text-amazon-link hover:underline mt-2 font-medium block"
                >
                  Clear department
                </button>
              )}
            </div>

            {/* Discount Percentage Filter */}
            <div className="border-t border-gray-200 pt-4">
              <span className="font-bold text-gray-900 block mb-2 text-xs">
                Discount
              </span>
              <ul className="space-y-1 text-gray-700">
                {[10, 20, 30, 50].map((pct) => (
                  <li key={pct}>
                    <button
                      onClick={() =>
                        setSelectedDiscountFilter(selectedDiscountFilter === pct ? null : pct)
                      }
                      className={`hover:text-amazon-link text-left block w-full py-0.5 ${
                        selectedDiscountFilter === pct ? "font-bold text-amazon-orange" : ""
                      }`}
                    >
                      {pct}% off or more
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to redeem callout */}
            <div className="border-t border-gray-200 pt-4 text-[11px] text-gray-500 space-y-1">
              <span className="font-bold text-gray-700 block">How to redeem coupons:</span>
              <p>1. Click <strong>Clip Coupon</strong> on any eligible item.</p>
              <p>2. The coupon code is copied and will apply at checkout.</p>
              <p>3. Complete purchase to enjoy your instant savings!</p>
            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="md:col-span-3 lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded border border-gray-200 shadow-2xs">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900">
                  {selectedDept === "All Coupons" ? "Amazon Coupons" : `${selectedDept} Coupons`}
                </h1>
                <p className="text-xs text-gray-500">
                  Showing {filteredProducts.length} of {COUPON_CATALOG.length} eligible products with instant percentage discounts
                </p>
              </div>
            </div>

            {/* Grid of Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((item) => {
                const isClipped = Boolean(clippedCoupons[item.id]);
                const convertedPrice = Math.round(item.price * rate);
                const convertedMrp = Math.round(item.mrp * rate);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded border border-gray-200 hover:shadow-md transition-shadow duration-150 p-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Image */}
                      <Link
                        href={`/dp/${item.productId}`}
                        className="block relative aspect-square w-full mb-3 overflow-hidden rounded bg-gray-50"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-contain p-2 hover:scale-105 transition-transform duration-200"
                        />
                      </Link>

                      {/* Green Coupon Callout (Percentage Discount ONLY) */}
                      <div className="mb-2">
                        <span className="inline-block bg-[#067d62]/10 text-[#067d62] border border-[#067d62]/30 text-xs font-bold px-2 py-0.5 rounded">
                          Save {item.discountPercent}% with coupon
                        </span>
                      </div>

                      {/* Product Title Link */}
                      <Link
                        href={`/dp/${item.productId}`}
                        className="text-xs text-gray-900 hover:text-amazon-orange font-medium line-clamp-2 leading-relaxed mb-1"
                        title={item.title}
                      >
                        {item.title}
                      </Link>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(item.rating)
                                  ? "fill-current"
                                  : "text-gray-300 fill-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-500">
                          {item.reviewCount.toLocaleString()}
                        </span>
                      </div>

                      {/* Price Section */}
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-sm font-bold text-gray-900">
                          {symbol}
                          {convertedPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          {symbol}
                          {convertedMrp.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-bold text-green-700">
                          {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% off
                        </span>
                      </div>

                      {/* Terms snippet */}
                      <p className="text-[11px] text-gray-500 line-clamp-2 mb-3">
                        {item.terms}
                      </p>
                    </div>

                    {/* Clip Coupon Button */}
                    <div className="pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleClip(item)}
                        className={`w-full py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 ${
                          isClipped
                            ? "bg-[#e7f4f0] text-[#067d62] border border-[#067d62] hover:bg-[#d8ece5]"
                            : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 shadow-2xs"
                        }`}
                      >
                        {isClipped ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#067d62]" />
                            <span>Coupon Clipped</span>
                          </>
                        ) : (
                          <>
                            <Scissors className="h-3.5 w-3.5 text-gray-500" />
                            <span>Clip Coupon</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
