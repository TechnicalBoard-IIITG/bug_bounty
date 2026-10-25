"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { ProductItem, INITIAL_PRODUCTS } from "@/lib/mockData";

const SLUG_TO_CATEGORY: Record<string, string> = {
  electronics: "Electronics",
  fashion: "Fashion",
  "home-kitchen": "Home & Kitchen",
  books: "Books",
};

export default function CategoryPage() {
  const params = useParams();
  const slug = (params.slug as string) || "electronics";
  const categoryName = SLUG_TO_CATEGORY[slug] || "Electronics";

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/products?category=${encodeURIComponent(categoryName)}&limit=30`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(INITIAL_PRODUCTS.filter((p) => p.category === categoryName));
        }
      })
      .catch(() => {
        setProducts(INITIAL_PRODUCTS.filter((p) => p.category === categoryName));
      })
      .finally(() => setIsLoading(false));
  }, [categoryName]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-amazon-text">
      {/* Category Banner */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Department: {categoryName}
        </h1>
        <p className="text-xs text-gray-600 mt-1">
          Explore the top deals, verified ratings, and bestsellers in {categoryName}.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-md" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
