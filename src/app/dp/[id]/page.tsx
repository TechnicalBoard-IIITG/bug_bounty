"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";
import { BuyBox } from "@/components/BuyBox";
import { ReviewSection } from "@/components/ReviewSection";
import { ProductItem, INITIAL_PRODUCTS } from "@/lib/mockData";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetailPage() {
  const params = useParams();
  const id = (params.id as string) || "";
  const currency = useCartStore((s) => s.currency);

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Variant Selection State
  const [selectedVariant, setSelectedVariant] = useState<string>("Standard");
  const [variantPriceOffset, setVariantPriceOffset] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setProduct(data);
        } else {
          const fallback = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id);
          if (fallback) setProduct(fallback);
        }
      })
      .catch(() => {
        const fallback = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id);
        if (fallback) setProduct(fallback);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-amazon-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-semibold">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-amazon-text">
        <h2 className="text-xl font-bold">Product not found</h2>
        <p className="text-xs text-gray-500 mt-2">
          The requested item may have been moved or removed.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 rounded bg-amazon-yellow px-4 py-2 text-xs font-bold"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  const effectivePrice = product.price + variantPriceOffset;
  const discountPercent = calculateDiscountPercent(product.mrp, effectivePrice);

  const variants = [
    { name: "Standard (Base)", offset: 0 },
    { name: "Pro Edition (+ $50.00)", offset: 50 },
    { name: "Ultra Deluxe Edition (+ $120.00)", offset: 120 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-amazon-text">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>&rsaquo;</span>
        <Link
          href={`/category/${product.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
          className="hover:underline"
        >
          {product.category}
        </Link>
        <span>&rsaquo;</span>
        <span className="text-gray-800 font-medium truncate max-w-sm">
          {product.title}
        </span>
      </div>

      {/* Main 3-Column Layout: Gallery | Product Info | Buy Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery (Cols 1-5) */}
        <div className="md:col-span-5 flex gap-4">
          <div className="flex flex-col gap-2 shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`h-16 w-16 rounded border p-1 overflow-hidden transition bg-white ${
                  selectedImageIndex === idx
                    ? "border-amazon-orange ring-1 ring-amazon-orange shadow"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center relative overflow-hidden group select-none">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              title={product.title}
              className="max-h-[420px] max-w-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Center Column: Core Details & Specs (Cols 6-9) */}
        <div className="md:col-span-4 space-y-4">
          <div>
            <Link
              href={`/s?brand=${encodeURIComponent(product.brand)}`}
              className="text-xs font-semibold text-amazon-link hover:underline uppercase tracking-wide"
            >
              Brand: {product.brand}
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mt-1">
              {product.title}
            </h1>
          </div>

          {/* Ratings Summary */}
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-current"
                      : "text-gray-300 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-amazon-link">
              {product.rating} ratings
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500">{product.reviewCount} reviews</span>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            {discountPercent > 0 && (
              <div className="text-xs font-bold text-red-700">-{discountPercent}%</div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amazon-price">
                {formatPrice(effectivePrice, currency)}
              </span>
              {product.mrp > effectivePrice && (
                <span className="text-xs text-gray-500 line-through">
                  M.R.P.: {formatPrice(product.mrp, currency)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Applicable sales tax calculated at checkout
            </p>
          </div>

          {/* Variant Selector */}
          <div className="border-t border-gray-200 pt-3">
            <span className="text-xs font-bold text-gray-800 block mb-2">
              Configuration / Edition:
            </span>
            <div className="flex flex-col gap-2">
              {variants.map((v) => (
                <button
                  key={v.name}
                  onClick={() => {
                    setSelectedVariant(v.name);
                    setVariantPriceOffset(v.offset);
                  }}
                  className={`text-left p-2.5 rounded border text-xs font-medium transition flex items-center justify-between ${
                    selectedVariant === v.name
                      ? "border-amazon-orange bg-amber-50/60 ring-1 ring-amazon-orange font-bold text-gray-900"
                      : "border-gray-300 hover:border-gray-400 bg-white text-gray-700"
                  }`}
                >
                  <span>{v.name}</span>
                  <span className="text-amazon-price">
                    {formatPrice(product.price + v.offset, currency)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Specs Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
                Technical Specifications
              </h4>
              <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                {Object.entries(product.specs).map(([k, v]) => (
                  <React.Fragment key={k}>
                    <span className="font-semibold text-gray-600">{k}</span>
                    <span className="text-gray-900">{v}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* About This Item */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              About this item
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Right Column: Buy Box (Cols 10-12) */}
        <div className="md:col-span-3">
          <BuyBox
            product={product}
            selectedVariantPrice={effectivePrice}
          />
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewSection
        productId={product.id}
        productTitle={product.title}
        initialRating={product.rating}
        initialReviewCount={product.reviewCount}
        initialReviews={[
          {
            id: "rev-init-1",
            userName: "Alex R. (Verified Buyer)",
            rating: 5,
            title: "Exceptional quality and fast delivery!",
            comment: "Arrived in perfect condition. Exactly as described, would highly recommend to anyone looking for premium quality.",
            isVerifiedPurchase: true,
            helpfulVotes: 14,
          },
          {
            id: "rev-init-2",
            userName: "Sarah M.",
            rating: 4,
            title: "Solid build, great value for money",
            comment: "Performs very well day to day. A minor detail could be improved in the documentation, but overall 4/5.",
            isVerifiedPurchase: true,
            helpfulVotes: 6,
          },
          {
            id: "rev-init-3",
            userName: "Disappointed Shopper",
            rating: 1,
            title: "Not what I expected",
            comment: "Found a few issues right out of the box. Customer support was okay, but I expected more.",
            isVerifiedPurchase: true,
            helpfulVotes: 2,
          },
        ]}
      />
    </div>
  );
}
