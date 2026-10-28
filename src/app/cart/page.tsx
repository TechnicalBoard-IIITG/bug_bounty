"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, Tag, Check, AlertCircle, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { isDefectActive } from "@/config/defects.config";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const currency = useCartStore((s) => s.currency);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const coupons = useCartStore((s) => s.coupons);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscountAmount = useCartStore((s) => s.getDiscountAmount);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const totalItemCount = getItemCount();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    setIsApplyingPromo(true);
    setPromoMessage(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCodeInput.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const result = applyCoupon(data.code, data.discountPercent, data.flatDiscount);
        setPromoMessage({ text: result.message, isError: !result.success });
        if (result.success) setPromoCodeInput("");
      } else {
        setPromoMessage({
          text: data.error || `Invalid promotional code "${promoCodeInput}"`,
          isError: true,
        });
      }
    } catch {
      setPromoMessage({ text: "Failed to validate promo code.", isError: true });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  // EASY_07: Mobile Viewport Action Overflow
  // At a 375px mobile viewport width, the "Proceed to Checkout" button on cart page is clipped horizontally off-screen
  const isMobileOverflowActive = isDefectActive("EASY_07_MOBILE_CHECKOUT_OVERFLOW");

  // MED_08: Line Item Quantity Multiplication
  // Increasing an item's quantity in cart updates quantity field, but leaves line-item subtotal at single-unit price
  const isLineItemBugActive = isDefectActive("MED_08_CART_LINE_ITEM_QTY_MULTIPLICATION");

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-amazon-text">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center max-w-xl mx-auto space-y-4">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Your Amazon Cart is empty</h2>
          <p className="text-xs text-gray-500">
            Check your Saved for later items or explore today&apos;s featured deals.
          </p>
          <Link
            href="/"
            className="inline-block rounded-md bg-amazon-yellow hover:bg-amazon-yellowHover px-6 py-2 text-xs font-bold shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-amazon-text">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Table (Cols 1-8) */}
        <div className="lg:col-span-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <span className="text-xs text-gray-500">Price</span>
          </div>

          <div className="divide-y divide-gray-200">
            {items.map((item) => {
              // Calculate row display price based on MED_08 defect
              const displayedRowPrice = isLineItemBugActive
                ? item.price // Bug: leaves line-item subtotal at single-unit price!
                : item.price * item.quantity;

              return (
                <div key={item.productId} className="py-5 flex gap-4">
                  {/* Thumbnail */}
                  <div className="h-28 w-28 shrink-0 bg-gray-50 rounded border border-gray-200 p-2 flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/dp/${item.productId}`}
                        className="text-sm font-semibold text-amazon-text hover:text-amazon-link hover:underline line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <span className="text-base font-bold text-gray-900 ml-4 shrink-0">
                        {formatPrice(displayedRowPrice, currency)}
                      </span>
                    </div>

                    <div className="text-xs text-green-700 font-semibold">In Stock</div>
                    <div className="text-[11px] text-gray-500">Eligible for FREE Shipping</div>

                    {/* Quantity Controls & Delete */}
                    <div className="flex items-center gap-4 pt-2 text-xs">
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 text-gray-700 transition"
                          title="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-0.5 text-xs font-bold text-gray-900 min-w-[2rem] text-center bg-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 text-gray-700 transition"
                          title="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-amazon-link hover:underline text-xs flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                        <span>Delete</span>
                      </button>

                      <span className="text-gray-300">|</span>
                      <span className="text-amazon-link hover:underline text-xs cursor-pointer">
                        Save for later
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtotal Footer */}
          <div className="border-t border-gray-200 pt-4 flex justify-end items-baseline gap-2">
            <span className="text-sm text-gray-700">
              Subtotal ({totalItemCount} {totalItemCount === 1 ? "item" : "items"}):
            </span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(subtotal, currency)}
            </span>
          </div>
        </div>

        {/* Right Column: Checkout Summary & Coupons (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
            <div className="flex items-center gap-2 text-xs text-green-700 font-semibold bg-green-50 p-2.5 rounded border border-green-200">
              <Check className="h-4 w-4 shrink-0" />
              <span>Your order qualifies for FREE Delivery in the US.</span>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700">
                Subtotal ({totalItemCount} items):
              </div>
              <div className="text-2xl font-extrabold text-amazon-price mt-0.5">
                {formatPrice(Math.max(0, subtotal - discount), currency)}
              </div>
              {discount > 0 && (
                <div className="text-xs text-green-700 font-semibold mt-1">
                  Total savings: {formatPrice(discount, currency)}
                </div>
              )}
            </div>

            {/* Proceed to Checkout Button with EASY_07 mobile overflow defect */}
            <div
              className={`pt-2 ${
                isMobileOverflowActive
                  ? "min-w-[440px] overflow-visible" // EASY_07: Clips off-screen on 375px mobile screens!
                  : "w-full"
              }`}
            >
              <button
                onClick={() => router.push("/checkout")}
                id="proceed-to-checkout-btn"
                className="w-full py-2.5 px-4 rounded-full bg-amazon-yellow hover:bg-amazon-yellowHover font-bold text-xs text-amazon-text shadow-sm transition"
              >
                Proceed to Checkout ({totalItemCount} items)
              </button>
            </div>
          </div>

          {/* Promo Code Application Box (MED_07 & HARD_14) */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 space-y-3">
            <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wide">
              <Tag className="h-4 w-4 text-amazon-orange" />
              Gift Cards & Promotional Codes
            </h4>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                placeholder="Enter promo code (e.g. SAVE10)"
                className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-xs uppercase font-medium focus:border-amazon-orange focus:outline-none"
              />
              <button
                type="submit"
                disabled={isApplyingPromo}
                className="rounded border border-gray-400 bg-gray-100 hover:bg-gray-200 px-4 py-1.5 text-xs font-bold text-gray-800 transition"
              >
                Apply
              </button>
            </form>

            {promoMessage && (
              <div
                className={`p-2 rounded text-xs flex items-center gap-1.5 ${
                  promoMessage.isError
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {promoMessage.isError ? (
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <Check className="h-3.5 w-3.5 shrink-0" />
                )}
                <span>{promoMessage.text}</span>
              </div>
            )}

            {/* Applied Coupons List */}
            {coupons.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <span className="text-[11px] font-bold text-gray-500 uppercase">
                  Applied Promos:
                </span>
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="flex items-center justify-between bg-amber-50 px-2.5 py-1.5 rounded text-xs border border-amber-200"
                  >
                    <div>
                      <span className="font-bold text-amber-900">{c.code}</span>
                      {c.appliedCount > 1 && (
                        <span className="ml-1 text-[10px] font-bold text-red-600 bg-red-100 px-1 rounded">
                          x{c.appliedCount} 
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeCoupon(c.code)}
                      className="text-gray-500 hover:text-red-600 text-xs"
                      title="Remove promo"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
