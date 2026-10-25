"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { ProductItem, INITIAL_PRODUCTS } from "@/lib/mockData";
import { isDefectActive } from "@/config/defects.config";
import { Star, ChevronRight, ChevronLeft, SlidersHorizontal } from "lucide-react";

function SearchCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentSort = searchParams.get("sort") || "featured";
  const currentPage = Number(searchParams.get("page") || "1");

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<ProductItem | null>(null);

  // Price Range Inputs
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  // MED_21: Infinite Scroll Duplication state
  const [duplicatedItems, setDuplicatedItems] = useState<ProductItem[]>([]);
  const bottomObserverRef = useRef<HTMLDivElement>(null);

  // Fetch products from /api/products
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", "12");

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          setTotalPages(data.totalPages || 1);
          setTotalCount(data.total || 0);
        }
      })
      .catch((err) => {
        console.error("Catalog fetch error:", err);
        setProducts(INITIAL_PRODUCTS.slice(0, 12));
      })
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  // MED_21: Infinite Scroll Duplication
  // Scrolling past the end of search results endlessly duplicates and re-renders the first few products in the grid
  useEffect(() => {
    if (!isDefectActive("MED_21_INFINITE_SCROLL_DUPLICATION")) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && products.length > 0) {
          // Append first 3 products repeatedly!
          setDuplicatedItems((prev) => [
            ...prev,
            ...products.slice(0, 3).map((p, i) => ({
              ...p,
              id: `${p.id}-dup-${Date.now()}-${i}`,
            })),
          ]);
        }
      },
      { threshold: 0.5 }
    );

    if (bottomObserverRef.current) {
      observer.observe(bottomObserverRef.current);
    }

    return () => observer.disconnect();
  }, [products]);

  // MED_02: Faceted Filter State Overwrite
  // Selecting a filter in a second facet (Category + Brand) removes the previously active filter selection
  const handleFacetClick = (facetType: "category" | "brand", value: string) => {
    const params = new URLSearchParams();

    if (isDefectActive("MED_02_FACETED_FILTER_OVERWRITE")) {
      // Overwrite bug: Only keep search query and the newly clicked facet!
      if (q) params.set("q", q);
      params.set(facetType, value);
    } else {
      // Proper behavior: Conjunctive refinement
      Array.from(searchParams.entries()).forEach(([k, v]) => params.set(k, v));
      if (value) {
        params.set(facetType, value);
      } else {
        params.delete(facetType);
      }
    }

    params.set("page", "1");
    router.push(`/s?${params.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`/s?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/s?${params.toString()}`);
  };

  const handlePriceFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (minPriceInput) params.set("minPrice", minPriceInput);
    if (maxPriceInput) params.set("maxPrice", maxPriceInput);
    params.set("page", "1");
    router.push(`/s?${params.toString()}`);
  };

  const categories = ["Electronics", "Fashion", "Home & Kitchen", "Books"];
  const brands = ["Sony", "Apple", "Samsung", "Logitech", "Levi's", "Nike", "Ninja", "Breville"];

  // EASY_17: Out-of-Bounds Pagination
  // Rapidly clicking "Next Page" exceeds maximum page limit, returning blank states instead of disabling button
  const isNextDisabled = isDefectActive("EASY_17_OUT_OF_BOUNDS_PAGINATION")
    ? false // Never disabled!
    : currentPage >= totalPages;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
        <div>
          <span className="text-xs text-gray-500">
            {totalCount > 0 ? `1-${products.length} of over ${totalCount} results` : "0 results"}
          </span>
          {q && (
            <h1 className="text-base font-bold text-gray-900">
              Results for <span className="text-amazon-orange">&quot;{q}&quot;</span>
            </h1>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <label className="text-gray-600 font-medium">Sort by:</label>
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded border border-gray-300 bg-gray-50 py-1.5 px-3 text-xs font-semibold text-gray-800 shadow-sm focus:border-amazon-orange focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-6">
        {/* Left Sidebar Faceted Filters */}
        <aside className="space-y-6 text-xs text-gray-800 border-r border-gray-200 pr-4">
          {/* Category Facet */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-2">Category</h4>
            <div className="space-y-1">
              <button
                onClick={() => handleFacetClick("category", "")}
                className={`block text-left w-full hover:text-amazon-orange ${
                  !currentCategory ? "font-bold text-amazon-orange" : "text-gray-700"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFacetClick("category", cat)}
                  className={`block text-left w-full hover:text-amazon-orange ${
                    currentCategory === cat ? "font-bold text-amazon-orange" : "text-gray-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Reviews Rating Filter */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-2">Customer Reviews</h4>
            <div className="space-y-1.5">
              {[4, 3, 2, 1].map((stars) => (
                <button
                  key={stars}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("minRating", String(stars));
                    router.push(`/s?${params.toString()}`);
                  }}
                  className="flex items-center gap-1.5 hover:text-amazon-orange group"
                >
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
                  <span className="text-[11px] text-gray-600 group-hover:underline">& Up</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Facet */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-2">Brand</h4>
            <div className="space-y-1">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentBrand === brand}
                    onChange={() => handleFacetClick("brand", currentBrand === brand ? "" : brand)}
                    className="rounded border-gray-300 text-amazon-orange focus:ring-amazon-orange"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-2">Price</h4>
            <form onSubmit={handlePriceFilterSubmit} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-16 rounded border border-gray-300 px-2 py-1 text-xs"
                />
                <span className="text-gray-500">to $</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-16 rounded border border-gray-300 px-2 py-1 text-xs"
                />
              </div>
              <button
                type="submit"
                className="rounded border border-gray-400 px-3 py-1 text-xs font-semibold hover:bg-gray-100 shadow-sm"
              >
                Go
              </button>
            </form>
          </div>
        </aside>

        {/* Right Product Grid */}
        <main className="md:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-md" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-md border border-gray-200 p-8">
              <h3 className="text-lg font-bold text-gray-800">No products found</h3>
              <p className="text-xs text-gray-500 mt-2">
                Try checking your spelling or use more general terms.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setSelectedQuickViewProduct}
                  />
                ))}

                {/* Duplicated Items for MED_21 */}
                {duplicatedItems.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setSelectedQuickViewProduct}
                  />
                ))}
              </div>

              {/* Infinite scroll sentinel for MED_21 */}
              <div ref={bottomObserverRef} className="h-6" />

              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-2 pt-8 border-t border-gray-200">
                {/* Previous Page */}
                <button
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-semibold transition ${
                    currentPage <= 1
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-400 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                {/* Page Number Buttons (includes MED_04 extra page) */}
                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1;
                  const isCurrent = pNum === currentPage;
                  return (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      className={`h-8 w-8 rounded text-xs font-bold transition ${
                        isCurrent
                          ? "bg-amazon-orange text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                {/* Next Page (EASY_17 out-of-bounds defect: never disabled if active) */}
                <button
                  disabled={isNextDisabled}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-semibold transition ${
                    isNextDisabled
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-400 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
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

export default function SearchCatalogPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading catalog...</div>}>
      <SearchCatalogContent />
    </Suspense>
  );
}
