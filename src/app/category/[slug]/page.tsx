"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { ProductItem, INITIAL_PRODUCTS, DEPARTMENTS } from "@/lib/mockData";
import { Star, ChevronRight, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, CURRENCY_SYMBOLS, CURRENCY_RATES } from "@/lib/utils";

const SLUG_TO_CATEGORY: Record<string, string> = {
  electronics: "Electronics",
  computers: "Computers",
  fashion: "Fashion",
  "home-kitchen": "Home & Kitchen",
  books: "Books",
  "beauty-health": "Beauty & Health",
};

const CATEGORY_TAGS: Record<string, string[]> = {
  Electronics: ["Headphones", "Smart TVs", "Cameras", "Soundbars", "Bluetooth Audio"],
  Computers: ["Laptops", "Mechanical Keyboards", "4K Monitors", "Gaming Mice", "Accessories"],
  Fashion: ["Jackets & Outerwear", "Denim & Jeans", "Footwear", "Watches", "Activewear"],
  "Home & Kitchen": ["Air Fryers", "Espresso Machines", "Blenders", "Cookware", "Vacuum Cleaners"],
  Books: ["Bestsellers", "Fiction", "Science & Tech", "Business & Finance", "Biographies"],
  "Beauty & Health": ["Skincare", "Oral Care", "Hair Care", "Fragrances", "Wellness"],
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params.slug as string) || "electronics";
  const categoryName = SLUG_TO_CATEGORY[slug] || "Electronics";

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<ProductItem | null>(null);

  // Filter & Sort state
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [primeOnly, setPrimeOnly] = useState(false);
  const currency = useCartStore((s) => s.currency);

  useEffect(() => {
    setIsLoading(true);
    const queryParams = new URLSearchParams();
    queryParams.set("category", categoryName);
    queryParams.set("limit", "40");
    if (selectedBrand) queryParams.set("brand", selectedBrand);
    if (sortBy) queryParams.set("sort", sortBy);
    if (priceRange.min !== undefined) queryParams.set("minPrice", String(priceRange.min));
    if (priceRange.max !== undefined) queryParams.set("maxPrice", String(priceRange.max));
    if (selectedRating !== null) queryParams.set("minRating", String(selectedRating));

    fetch(`/api/products?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          let list = INITIAL_PRODUCTS.filter((p) => p.category === categoryName);
          if (selectedBrand) list = list.filter((p) => p.brand === selectedBrand);
          if (selectedRating) list = list.filter((p) => p.rating >= selectedRating);
          if (priceRange.min) list = list.filter((p) => p.price >= priceRange.min!);
          if (priceRange.max) list = list.filter((p) => p.price <= priceRange.max!);
          setProducts(list);
        }
      })
      .catch(() => {
        let list = INITIAL_PRODUCTS.filter((p) => p.category === categoryName);
        setProducts(list);
      })
      .finally(() => setIsLoading(false));
  }, [categoryName, selectedBrand, sortBy, priceRange, selectedRating]);

  // Extract unique brands for this department
  const allDeptProducts = INITIAL_PRODUCTS.filter((p) => p.category === categoryName);
  const brands = Array.from(new Set(allDeptProducts.map((p) => p.brand)));

  const handlePriceFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = CURRENCY_RATES[currency] || 1;
    setPriceRange({
      min: minPriceInput ? Number(minPriceInput) / rate : undefined,
      max: maxPriceInput ? Number(maxPriceInput) / rate : undefined,
    });
  };

  const clearAllFilters = () => {
    setSelectedBrand("");
    setSelectedRating(null);
    setPriceRange({});
    setMinPriceInput("");
    setMaxPriceInput("");
    setSortBy("featured");
    setPrimeOnly(false);
  };

  const displayedProducts = primeOnly ? products.filter((p) => p.isPrime) : products;

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-4 text-amazon-text">
      {/* Amazon Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-1 mb-4">
        <Link href="/" className="hover:underline text-amazon-link">
          Amazon
        </Link>
        <span>&rsaquo;</span>
        <span className="text-gray-700 font-semibold">{categoryName}</span>
      </nav>

      {/* Department Header & Subcategory Tag Pills */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {categoryName}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Shop top deals, customer favorites, and verified brand bestsellers
            </p>
          </div>

          {/* Quick Tag Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {(CATEGORY_TAGS[categoryName] || []).map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  router.push(`/s?q=${encodeURIComponent(tag)}&category=${encodeURIComponent(categoryName)}`);
                }}
                className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded-full text-xs font-medium text-gray-700 shadow-sm whitespace-nowrap transition cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Filters (Cols 1-3) */}
        <aside className="lg:col-span-3 space-y-5 text-xs bg-white p-4 rounded-md border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <span className="font-bold text-gray-900 text-sm">Filters</span>
            {(selectedBrand || selectedRating || priceRange.min !== undefined || priceRange.max !== undefined || primeOnly) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-amazon-link hover:underline font-semibold cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Department Navigator */}
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Departments</h3>
            <ul className="space-y-1.5 pl-1">
              {DEPARTMENTS.map((dept) => {
                const deptSlug = dept.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
                const isActive = dept === categoryName;
                return (
                  <li key={dept}>
                    <Link
                      href={`/category/${deptSlug}`}
                      className={`block py-0.5 transition ${
                        isActive
                          ? "font-bold text-amazon-orange"
                          : "text-gray-700 hover:text-amazon-link hover:underline"
                      }`}
                    >
                      {dept}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Prime Delivery Filter */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-bold text-gray-900 mb-2">Delivery &amp; Benefits</h3>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={primeOnly}
                onChange={(e) => setPrimeOnly(e.target.checked)}
                className="rounded border-gray-300 text-amazon-yellow focus:ring-amazon-yellow h-4 w-4"
              />
              <span className="font-bold text-[#00a8e1] flex items-center gap-0.5">
                prime <span className="text-gray-700 font-normal text-xs">FREE Delivery</span>
              </span>
            </label>
          </div>

          {/* Customer Reviews Rating Filter */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-bold text-gray-900 mb-2">Customer Reviews</h3>
            <div className="space-y-1">
              {[4, 3, 2, 1].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setSelectedRating(selectedRating === stars ? null : stars)}
                  className={`w-full flex items-center justify-between py-1 px-1.5 rounded transition text-left cursor-pointer ${
                    selectedRating === stars ? "bg-amber-50 font-bold" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < stars ? "fill-current" : "text-gray-300 fill-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-700 text-xs">&amp; Up</span>
                  </div>
                  {selectedRating === stars && <Check className="h-3.5 w-3.5 text-amazon-orange" />}
                </button>
              ))}
            </div>
          </div>

          {/* Brands Filter */}
          {brands.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-gray-900 mb-2">Featured Brands</h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar pr-1">
                {brands.map((b) => (
                  <label
                    key={b}
                    className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-amazon-orange transition select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrand === b}
                      onChange={() => setSelectedBrand(selectedBrand === b ? "" : b)}
                      className="rounded border-gray-300 text-amazon-yellow focus:ring-amazon-yellow h-3.5 w-3.5"
                    />
                    <span className={`text-xs ${selectedBrand === b ? "font-bold text-amazon-orange" : "text-gray-700"}`}>
                      {b}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-bold text-gray-900 mb-2">Price</h3>
            <div className="space-y-1 mb-2">
              <button
                onClick={() => setPriceRange({ max: 50 })}
                className="block text-left text-gray-700 hover:text-amazon-link hover:underline py-0.5"
              >
                Under {formatPrice(50, currency)}
              </button>
              <button
                onClick={() => setPriceRange({ min: 50, max: 100 })}
                className="block text-left text-gray-700 hover:text-amazon-link hover:underline py-0.5"
              >
                {formatPrice(50, currency)} to {formatPrice(100, currency)}
              </button>
              <button
                onClick={() => setPriceRange({ min: 100, max: 200 })}
                className="block text-left text-gray-700 hover:text-amazon-link hover:underline py-0.5"
              >
                {formatPrice(100, currency)} to {formatPrice(200, currency)}
              </button>
              <button
                onClick={() => setPriceRange({ min: 200 })}
                className="block text-left text-gray-700 hover:text-amazon-link hover:underline py-0.5"
              >
                {formatPrice(200, currency)} &amp; Above
              </button>
            </div>

            <form onSubmit={handlePriceFilterSubmit} className="flex items-center gap-1.5 mt-2">
              <div className="relative flex-1">
                <span className="absolute left-2 top-1.5 text-gray-400 text-xs">{CURRENCY_SYMBOLS[currency] || "₹"}</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-full pl-5 pr-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-amazon-orange"
                />
              </div>
              <span className="text-gray-400">-</span>
              <div className="relative flex-1">
                <span className="absolute left-2 top-1.5 text-gray-400 text-xs">{CURRENCY_SYMBOLS[currency] || "₹"}</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full pl-5 pr-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-amazon-orange"
                />
              </div>
              <button
                type="submit"
                className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-400 rounded text-xs font-semibold shadow-sm"
              >
                Go
              </button>
            </form>
          </div>
        </aside>

        {/* Right Column: Results & Product Grid (Cols 4-12) */}
        <main className="lg:col-span-9 space-y-4">
          {/* Top Sort & Results Bar */}
          <div className="bg-white px-4 py-2.5 rounded-md border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-gray-600 font-medium">
              1-{displayedProducts.length} of {displayedProducts.length} results in{" "}
              <span className="font-bold text-gray-900">{categoryName}</span>
            </span>

            <div className="flex items-center gap-2">
              <label className="text-gray-600 font-medium whitespace-nowrap">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded px-2.5 py-1 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-amazon-orange cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-white border border-gray-200 rounded-md p-4 animate-pulse flex flex-col justify-between">
                  <div className="h-44 bg-gray-100 rounded" />
                  <div className="space-y-2 mt-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="bg-white rounded-md border border-gray-200 p-12 text-center space-y-3">
              <h3 className="text-base font-bold text-gray-900">No products match your current filters</h3>
              <p className="text-xs text-gray-500">
                Try resetting your filters or selecting a different brand or price range.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-2 px-4 py-1.5 bg-amazon-yellow hover:bg-amazon-yellowHover text-gray-900 rounded text-xs font-bold shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedQuickViewProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />
    </div>
  );
}
