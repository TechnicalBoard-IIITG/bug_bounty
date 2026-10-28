"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { ProductItem, INITIAL_PRODUCTS, DEPARTMENTS } from "@/lib/mockData";
import { Zap, Clock, Sparkles, Filter } from "lucide-react";

export default function DealsPage() {
  const [deals, setDeals] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedDiscountTier, setSelectedDiscountTier] = useState<number | null>(null);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/products?limit=60")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          const dealProducts = data.products.filter((p: ProductItem) => p.isDeal || p.price < p.mrp);
          setDeals(dealProducts);
        } else {
          setDeals(INITIAL_PRODUCTS.filter((p) => p.isDeal || p.price < p.mrp));
        }
      })
      .catch(() => {
        setDeals(INITIAL_PRODUCTS.filter((p) => p.isDeal || p.price < p.mrp));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredDeals = deals.filter((p) => {
    if (selectedDept !== "all" && p.category !== selectedDept) return false;
    if (selectedDiscountTier !== null) {
      const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
      if (discount < selectedDiscountTier) return false;
    }
    return true;
  });

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6 text-amazon-text">
      {/* Deals Header Banner */}
      <div className="bg-gradient-to-r from-[#232f3e] to-[#131921] text-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-full bg-[#cc0c39] text-white">
                <Zap className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#febd69]">
                Today&apos;s Featured Promotions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Today&apos;s Lightning &amp; Daily Deals
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Deals refreshed daily. Quantities are limited and prices valid while supplies last.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-black/30 border border-gray-700 px-3 py-2 rounded-md">
            <Clock className="h-4 w-4 text-[#febd69]" />
            <span>Next deal refresh in <strong className="text-white">05h 42m</strong></span>
          </div>
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-5 border-t border-gray-700 mt-5">
          <button
            onClick={() => setSelectedDept("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedDept === "all"
                ? "bg-[#febd69] text-gray-900"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            All Deals ({deals.length})
          </button>
          {DEPARTMENTS.map((dept) => {
            const count = deals.filter((d) => d.category === dept).length;
            if (count === 0) return null;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedDept === dept
                    ? "bg-[#febd69] text-gray-900"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {dept} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Deals Grid with Secondary Discount Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3 mb-6">
        <span className="text-xs text-gray-600 font-medium">
          Showing <strong className="text-gray-900">{filteredDeals.length}</strong> discounted offers
        </span>

        {/* Discount Tier Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 font-medium">Discount:</span>
          <button
            onClick={() => setSelectedDiscountTier(null)}
            className={`px-2.5 py-1 rounded border text-xs font-semibold cursor-pointer ${
              selectedDiscountTier === null
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedDiscountTier(10)}
            className={`px-2.5 py-1 rounded border text-xs font-semibold cursor-pointer ${
              selectedDiscountTier === 10
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            10% off+
          </button>
          <button
            onClick={() => setSelectedDiscountTier(15)}
            className={`px-2.5 py-1 rounded border text-xs font-semibold cursor-pointer ${
              selectedDiscountTier === 15
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            15% off+
          </button>
          <button
            onClick={() => setSelectedDiscountTier(20)}
            className={`px-2.5 py-1 rounded border text-xs font-semibold cursor-pointer ${
              selectedDiscountTier === 20
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            20% off+
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-72 bg-white border border-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="bg-white rounded-md border border-gray-200 p-12 text-center space-y-3">
          <h3 className="text-base font-bold text-gray-900">No lightning deals currently match this filter</h3>
          <p className="text-xs text-gray-500">
            Check back shortly or view deals in other departments.
          </p>
          <button
            onClick={() => {
              setSelectedDept("all");
              setSelectedDiscountTier(null);
            }}
            className="mt-2 px-4 py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 rounded text-xs font-bold shadow-sm"
          >
            View All Deals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredDeals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setSelectedQuickViewProduct}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />
    </div>
  );
}
