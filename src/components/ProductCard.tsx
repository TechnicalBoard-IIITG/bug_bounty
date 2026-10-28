"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Heart, Check, Eye } from "lucide-react";
import { ProductItem } from "@/lib/mockData";
import { formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { UI_CONFIG } from "@/lib/uiDefects";

interface ProductCardProps {
  product: ProductItem;
  onQuickView?: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const addItem = useCartStore((s) => s.addItem);
  const currency = useCartStore((s) => s.currency);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: product.price,
      mrp: product.mrp,
      imageUrl: product.images[0] || "",
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  let displayImage = product.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80";
  if (
    UI_CONFIG.catalogCardImageIndex === 1 &&
    (product.id === "prod-f01" || product.title.toLowerCase().includes("jacket"))
  ) {
    displayImage = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";
  }

  const discountPercent = calculateDiscountPercent(product.mrp, product.price);

  return (
    <div className="group relative bg-white border border-gray-200 rounded p-4 flex flex-col justify-between hover:border-gray-300 hover:shadow-md transition-all duration-200 text-amazon-text">
      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm z-10 transition border border-gray-100"
        title="Add to Wishlist"
      >
        <Heart
          className={`h-4 w-4 ${
            isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
          }`}
        />
      </button>

      <div>
        {/* Product Image Container */}
        <Link
          href={`/dp/${product.slug || product.id}`}
          className="relative block h-52 w-full overflow-hidden rounded bg-white flex items-center justify-center p-2"
        >
          <img
            src={displayImage}
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-[#cc0c39] text-white font-bold text-[10px] px-1.5 py-0.5 rounded">
              {discountPercent}% off
            </span>
          )}
        </Link>

        {/* Brand & Title */}
        <div className="mt-3">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            {product.brand}
          </span>
          <Link
            href={`/dp/${product.slug || product.id}`}
            className="block text-xs font-semibold text-gray-900 hover:text-amazon-link hover:underline line-clamp-2 mt-0.5 leading-snug"
          >
            {product.title}
          </Link>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-current"
                    : "text-gray-300 fill-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-amazon-link font-medium hover:underline">
            {product.reviewCount}
          </span>
        </div>

        {/* Price Section */}
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price, currency)}
          </span>
          {product.mrp > product.price && (
            <span className="text-[11px] text-gray-500 line-through">
              {formatPrice(product.mrp, currency)}
            </span>
          )}
        </div>

        {/* Prime & Delivery Note */}
        <div className="mt-1 flex items-center gap-1">
          <span className="text-[11px] font-black text-[#00a8e1] tracking-tight">
            prime
          </span>
          <span className="text-[10px] text-gray-600">FREE delivery Tomorrow</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1 cursor-pointer ${
            added
              ? "bg-green-600 text-white"
              : "bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900"
          }`}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5" /> Added
            </>
          ) : (
            "Add to Cart"
          )}
        </button>

        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
            title="Quick View"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
