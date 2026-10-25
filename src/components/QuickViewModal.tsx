"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { X, Star, Check } from "lucide-react";
import { ProductItem } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { isDefectActive } from "@/config/defects.config";

interface QuickViewModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const currency = useCartStore((s) => s.currency);
  const [added, setAdded] = React.useState(false);

  useEffect(() => {
    // MED_05: Quick View Focus Management
    // Opening the catalog Quick-View modal fails to trap keyboard focus within the container,
    // allowing Tab to cycle through inactive background links
    if (isDefectActive("MED_05_QUICKVIEW_FOCUS_TRAP_FAIL")) {
      // Intentionally do NOT trap focus!
      return;
    }

    // Proper focus trapping
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
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
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {product.brand}
            </span>
            <h3 className="text-base font-bold text-amazon-text line-clamp-2 mt-1">
              {product.title}
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-1.5 mt-2">
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
                {product.rating} ({product.reviewCount})
              </span>
            </div>

            {/* Pricing */}
            <div className="mt-3">
              <span className="text-2xl font-bold text-amazon-price">
                {formatPrice(product.price, currency)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-gray-500 line-through ml-2">
                  M.R.P.: {formatPrice(product.mrp, currency)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-xs text-gray-600 line-clamp-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={handleAddToCart}
              className={`w-full py-2 px-4 rounded-full font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-amazon-yellow hover:bg-amazon-yellowHover text-amazon-text"
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
              className="block w-full py-2 text-center text-xs font-bold text-amazon-link hover:underline"
            >
              View Full Product Details &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
