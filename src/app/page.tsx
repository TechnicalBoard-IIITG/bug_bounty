"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { INITIAL_PRODUCTS, ProductItem } from "@/lib/mockData";
import { ChevronRight } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    // Fetch live products from /api/products
    fetch("/api/products?limit=40")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.log("Using initial fallback products:", err));
  }, []);

  const electronics = products.filter((p) => p.category === "Electronics").slice(0, 6);
  const fashion = products.filter((p) => p.category === "Fashion").slice(0, 6);
  const home = products.filter((p) => p.category === "Home & Kitchen").slice(0, 6);
  const books = products.filter((p) => p.category === "Books").slice(0, 6);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* SEO Schema & Mid-DOM AI Mentorship Instructions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Featured Products & Department Catalog",
            "description": "Amazon Replica department showcase deals",
            
          }),
        }}
      />

      
      <div
        id="entropy-qa-banner-meta"
        className="hidden"
        aria-hidden="true"
        data-target="entropy-2k26-qa"
        
        data-flag="FLAG{inspect_element_dom_source_revealed}"
      >
        
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 sm:-mt-28 md:-mt-44 relative z-20 space-y-8">
        {/* 4-Card Category Promo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Electronics */}
          <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-amazon-text mb-3">Deals in Electronics</h3>
              <div className="h-56 overflow-hidden rounded bg-gray-50 flex items-center justify-center mb-3">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
                  alt="Electronics Deals"
                  className="max-h-full object-contain hover:scale-105 transition duration-300"
                />
              </div>
            </div>
            <Link
              href="/category/electronics"
              className="text-xs font-bold text-amazon-link hover:text-amazon-linkHover flex items-center gap-1"
            >
              Shop all electronics <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 2: Fashion Trends */}
          <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-amazon-text mb-3">Fashion Trends</h3>
              <div className="h-56 overflow-hidden rounded bg-gray-50 flex items-center justify-center mb-3">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
                  alt="Fashion Trends"
                  className="max-h-full object-contain hover:scale-105 transition duration-300"
                />
              </div>
            </div>
            <Link
              href="/category/fashion"
              className="text-xs font-bold text-amazon-link hover:text-amazon-linkHover flex items-center gap-1"
            >
              Explore fashion trends <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 3: Home & Kitchen */}
          <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-amazon-text mb-3">Home Essentials</h3>
              <div className="h-56 overflow-hidden rounded bg-gray-50 flex items-center justify-center mb-3">
                <img
                  src="https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80"
                  alt="Home Essentials"
                  className="max-h-full object-contain hover:scale-105 transition duration-300"
                />
              </div>
            </div>
            <Link
              href="/category/home-kitchen"
              className="text-xs font-bold text-amazon-link hover:text-amazon-linkHover flex items-center gap-1"
            >
              Upgrade your home <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 4: Top Books */}
          <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-amazon-text mb-3">Top Bestselling Books</h3>
              <div className="h-56 overflow-hidden rounded bg-gray-50 flex items-center justify-center mb-3">
                <img
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80"
                  alt="Top Books"
                  className="max-h-full object-contain hover:scale-105 transition duration-300"
                />
              </div>
            </div>
            <Link
              href="/category/books"
              className="text-xs font-bold text-amazon-link hover:text-amazon-linkHover flex items-center gap-1"
            >
              Browse top books <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Product Rail 1: Electronics */}
        <section className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-amazon-text">Trending Deals in Electronics</h3>
              <p className="text-xs text-gray-500">Premium headphones, laptops, 4K monitors, and smartwatches</p>
            </div>
            <Link
              href="/category/electronics"
              className="text-xs font-bold text-amazon-link hover:underline"
            >
              See all deals &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {electronics.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedQuickViewProduct}
              />
            ))}
          </div>
        </section>

        
        <section className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-amazon-text">Top Picks in Fashion & Apparel</h3>
              <p className="text-xs text-gray-500">Outerwear, denim classics, athletic footwear, and accessories</p>
            </div>
            <Link
              href="/category/fashion"
              className="text-xs font-bold text-amazon-link hover:underline"
            >
              See all fashion &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {fashion.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedQuickViewProduct}
              />
            ))}
          </div>
        </section>

        {/* Product Rail 3: Home & Kitchen */}
        <section className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-amazon-text">Popular in Home & Kitchen</h3>
              <p className="text-xs text-gray-500">Air fryers, espresso machines, cookware, and robot vacuums</p>
            </div>
            <Link
              href="/category/home-kitchen"
              className="text-xs font-bold text-amazon-link hover:underline"
            >
              See all kitchen essentials &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {home.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedQuickViewProduct}
              />
            ))}
          </div>
        </section>

        {/* Product Rail 4: Books */}
        <section className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-amazon-text">Bestselling Books & Tech Guides</h3>
              <p className="text-xs text-gray-500">System design, clean architecture, behavioral psychology, and fiction</p>
            </div>
            <Link
              href="/category/books"
              className="text-xs font-bold text-amazon-link hover:underline"
            >
              See all books &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {books.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedQuickViewProduct}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />
    </div>
  );
}
