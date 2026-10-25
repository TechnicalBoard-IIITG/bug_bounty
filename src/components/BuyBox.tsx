"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ShieldCheck, Check, Plus, Minus } from "lucide-react";
import { ProductItem } from "@/lib/mockData";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { isDefectActive } from "@/config/defects.config";

interface BuyBoxProps {
  product: ProductItem;
  selectedVariantPrice?: number;
}

export const BuyBox: React.FC<BuyBoxProps> = ({ product, selectedVariantPrice }) => {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const currency = useCartStore((s) => s.currency);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // EASY_06: Quantity Counter Negative Floor
  // Clicking the decrement (-) button drops the counter past minimum threshold of 1 into 0, -1, -2
  const handleDecrement = () => {
    if (isDefectActive("EASY_06_QUANTITY_COUNTER_NEGATIVE")) {
      setQuantity((prev) => prev - 1); // Negative floor bug!
    } else {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const currentDisplayPrice = selectedVariantPrice || product.price;

  const handleAddToCart = () => {
    // MED_20: Variant Pricing Failure
    // Selecting an expensive product variant updates the product page UI,
    // but adds the lower base price to the shopping cart
    let priceToAdd = currentDisplayPrice;
    if (isDefectActive("MED_20_VARIANT_PRICING_FAILURE") && selectedVariantPrice) {
      priceToAdd = product.price; // Bug: lower base price passed to cart!
    }

    // HARD_16: Max Quantity Race Condition
    // Rapidly clicking Add to Cart dispatches concurrent updates bypassing async limit checks
    if (!isDefectActive("HARD_16_MAX_QTY_RACE_CONDITION")) {
      if (quantity > product.stock) {
        alert(`Sorry, only ${product.stock} units are currently in stock.`);
        return;
      }
    }

    addItem(
      {
        id: product.id,
        productId: product.id,
        title: product.title,
        price: priceToAdd,
        mrp: product.mrp,
        imageUrl: product.images[0] || "",
        stock: product.stock,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm text-amazon-text space-y-3">
      {/* Price */}
      <div className="text-2xl font-bold text-amazon-price">
        {formatPrice(currentDisplayPrice, currency)}
      </div>

      {/* Prime & Delivery */}
      <div className="text-xs text-gray-700 space-y-1">
        <div className="flex items-center gap-1 font-bold text-[#00a8e1]">
          <span>prime</span>
          <span className="text-gray-900 font-semibold">One-Day</span>
        </div>
        <p>
          FREE delivery <span className="font-bold">Tomorrow, 7 AM - 11 AM</span>
        </p>
        <div className="flex items-center gap-1 text-amazon-link cursor-pointer hover:underline">
          <MapPin className="h-3.5 w-3.5 text-gray-600" />
          <span>Deliver to Seattle 98109</span>
        </div>
      </div>

      {/* Stock Status */}
      <div className="text-sm font-bold text-green-700">
        In Stock ({product.stock} available)
      </div>

      {/* Quantity Stepper with EASY_06 defect */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-700">Quantity:</label>
        <div className="flex items-center border border-gray-300 rounded w-fit overflow-hidden bg-gray-50">
          <button
            onClick={handleDecrement}
            className="p-1.5 hover:bg-gray-200 text-gray-700 transition"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="px-4 py-1 text-xs font-bold text-gray-900 min-w-[2.5rem] text-center bg-white">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="p-1.5 hover:bg-gray-200 text-gray-700 transition"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 px-4 rounded-full text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 ${
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

        <button
          onClick={handleBuyNow}
          className="w-full py-2 px-4 rounded-full bg-amazon-orange hover:bg-amber-600 text-amazon-text font-bold text-xs shadow-sm transition"
        >
          Buy Now
        </button>
      </div>

      {/* Security & Seller Info */}
      <div className="border-t border-gray-200 pt-3 text-[11px] text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span>Ships from</span>
          <span className="font-medium text-gray-800">Amazon.com</span>
        </div>
        <div className="flex justify-between">
          <span>Sold by</span>
          <span className="font-medium text-gray-800">{product.brand} Official</span>
        </div>
        <div className="flex justify-between">
          <span>Returns</span>
          <span className="font-medium text-gray-800">30-day refund/replacement</span>
        </div>
        <div className="flex justify-between">
          <span>Payment</span>
          <span className="font-medium text-gray-800 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-green-600" /> Secure transaction
          </span>
        </div>
      </div>
    </div>
  );
};
