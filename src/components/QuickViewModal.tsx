"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { X, Star, Check } from "lucide-react";
import { ProductItem } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

interface QuickViewModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const currency = useCartStore((s) => s.currency);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
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
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-amazon-text max-h-[90vh] flex flex-col md:flex-row"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black p-1 rounded-full hover:bg-gray-100 z-10"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Product Image */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-200">
          <img
            src={product.images[0]}
            alt={product.title}
            className="max-h-64 object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">
              {product.brand}
            </span>
            <h2 className="text-lg font-bold text-gray-900 mt-1 leading-snug">
              {product.title}
            </h2>

            {/* Ratings */}
            <div className="flex items-center gap-1 mt-2">
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
              <span className="text-xs text-amazon-link">
                ({product.reviewCount} ratings)
              </span>
            </div>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amazon-price">
                {formatPrice(product.price, currency)}
              </span>
              {product.mrp > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.mrp, currency)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-xs text-gray-600 line-clamp-3">
              {product.description}
            </p>

            {/* Stock status */}
            <div className="mt-3">
              {product.stock > 0 ? (
                <span className="text-xs font-semibold text-green-700">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-xs font-semibold text-red-600">
                  Currently unavailable
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`w-full py-2.5 px-4 rounded-full text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-amazon-yellow hover:bg-amazon-yellowHover text-amazon-text disabled:opacity-50"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Added to Cart
                </>
              ) : (
                "Add to Cart"
              )}
            </button>

            <Link
              href={`/dp/${product.slug || product.id}`}
              onClick={onClose}
              className="w-full py-2 px-4 rounded-full text-xs font-semibold text-center border border-gray-300 hover:bg-gray-50 text-gray-700 transition"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
