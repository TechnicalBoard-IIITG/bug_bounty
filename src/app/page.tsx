"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { INITIAL_PRODUCTS, ProductItem } from "@/lib/mockData";
import { ChevronRight, Zap, Sparkles } from "lucide-react";
import { SignInPromptBanner } from "@/components/SignInPromptBanner";
import { SignInGateModal } from "@/components/SignInGateModal";

export default function HomePage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    fetch("/api/products?limit=60")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  const electronics = products.filter((p) => p.category === "Electronics").slice(0, 6);
  const computers = products.filter((p) => p.category === "Computers").slice(0, 6);
  const fashion = products.filter((p) => p.category === "Fashion").slice(0, 6);
  const home = products.filter((p) => p.category === "Home & Kitchen").slice(0, 6);
  const books = products.filter((p) => p.category === "Books").slice(0, 6);
  const beauty = products.filter((p) => p.category === "Beauty & Health").slice(0, 6);
  const deals = products.filter((p) => p.isDeal).slice(0, 6);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Carousel */}
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 -mt-16 sm:-mt-24 md:-mt-36 relative z-20 space-y-8">
        {/* Amazon Auth Onboarding & Isolation Banner */}
        <SignInPromptBanner />

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
          <div className="bg-white p-5 rounded-md shadow-md border border-gray-200 flex flex-col justify-between">
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

        {/* Today's Deals Rail */}
        {deals.length > 0 && (
          <section className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-full bg-red-600 text-white">
                  <Zap className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-amazon-text">Today&apos;s Lightning Deals</h3>
                  <p className="text-xs text-gray-500">Limited time offers updated daily</p>
                </div>
              </div>
              <Link
                href="/deals"
                className="text-xs font-bold text-amazon-link hover:underline"
              >
                See all deals &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {deals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedQuickViewProduct}
                />
              ))}
            </div>
          </section>
        )}

        {/* Product Rail 1: Electronics */}
        <section className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-amazon-text">Trending Deals in Electronics</h3>
              <p className="text-xs text-gray-500">Premium headphones, 4K monitors, and smart audio</p>
            </div>
            <Link
              href="/category/electronics"
              className="text-xs font-bold text-amazon-link hover:underline"
            >
              See all electronics &rarr;
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

        {/* Product Rail 2: Computers */}
        <section className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-amazon-text">Computers, Laptops & Accessories</h3>
              <p className="text-xs text-gray-500">High-performance workstations, mechanical keyboards, and gaming displays</p>
            </div>
            <Link
              href="/category/computers"
              className="text-xs font-bold text-amazon-link hover:underline"
            >
              See all computers &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {computers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setSelectedQuickViewProduct}
              />
            ))}
          </div>
        </section>

        {/* Product Rail 3: Fashion */}
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

        {/* Product Rail 4: Home & Kitchen */}
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

        {/* Product Rail 5: Books */}
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

        {/* Product Rail 6: Beauty & Health */}
        <section className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-pink-100 text-pink-600">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-amazon-text">Beauty & Personal Care</h3>
                <p className="text-xs text-gray-500">Skincare, hair styling, oral care, and wellness essentials</p>
              </div>
            </div>
            <Link
              href="/category/beauty-health"
              className="text-xs font-bold text-amazon-link hover:underline"
            >
              See all beauty &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {beauty.map((product) => (
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

      {/* First-arrival Mandatory Sign-In Gate Modal */}
      <SignInGateModal />
    </div>
  );
}
