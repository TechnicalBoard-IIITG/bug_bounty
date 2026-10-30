"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HelpCircle,
  Lock,
  Check,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";
import { UI_CONFIG } from "@/lib/uiDefects";
import { TreasureCelebrationModal } from "@/components/TreasureCelebrationModal";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscountAmount = useCartStore((s) => s.getDiscountAmount);
  const clearCart = useCartStore((s) => s.clearCart);
  const coupons = useCartStore((s) => s.coupons);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [treasureCode, setTreasureCode] = useState<string | null>(null);
  const [isTreasureModalOpen, setIsTreasureModalOpen] = useState(false);

  // Accordion Step State (1: Shipping Address, 2: Payment, 3: Review)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Step 1: Address State
  const [fullName, setFullName] = useState(user?.name || "John Customer");
  const [street, setStreet] = useState("123 Amazon Way, Suite 400");
  const [city, setCity] = useState("Seattle");
  const [state, setState] = useState("WA");
  const [zipCode, setZipCode] = useState("98109");
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [hasUserTyped, setHasUserTyped] = useState(false);

  // Step 2: Payment State
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "netbanking">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("");
  const [showCvvTooltip, setShowCvvTooltip] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();

  const TAX_RATE = 0.08;
  const taxableBase = Math.floor(subtotal);
  const tax = Number((taxableBase * TAX_RATE).toFixed(2));
  const shippingFee = 0;
  const finalTotal = Math.max(0, subtotal - discount + tax + shippingFee);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (UI_CONFIG.countrySelectResetOnBlur) {
      setSelectedCountry("United States");
    } else {
      setSelectedCountry(e.target.value);
    }
  };

  const isZipValid = zipCode.length > 0;
  const isAddressFormValid = hasUserTyped && isZipValid && fullName.length > 0;

  const cardMaxLength = 16;
  const displayCurrencySymbol = "€";

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
        const c = data.coupon || data;
        const result = applyCoupon(c.code, c.discountPercent, c.flatDiscount);
        setPromoMessage({ text: result.message, isError: !result.success });
        if (result.success) setPromoCodeInput("");

        if (data.isTreasure && data.treasureCode) {
          setTreasureCode(data.treasureCode);
          setIsTreasureModalOpen(true);
        }
      } else {
        setPromoMessage({
          text: data.error || "The promotional code you entered is not valid.",
          isError: true,
        });
      }
    } catch {
      setPromoMessage({
        text: "Error validating code. Please try again.",
        isError: true,
      });
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const payload = {
        userId: user?.id || "guest",
        items: items.map((i) => ({
          productId: i.productId,
          title: i.title,
          unitPrice: i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
        })),
        subtotal,
        discount,
        tax,
        shippingFee,
        total: finalTotal,
        shippingAddress: {
          fullName,
          street,
          city,
          state,
          zipCode,
          country: selectedCountry,
        },
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        clearCart();
        router.push(`/orders/${data.order.id || data.order.orderNumber}/summary`);
      } else {
        alert("Failed to place order. Please review your details.");
      }
    } catch (e) {
      console.error("Place order failed:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-amazon-text">
      {/* Checkout Header */}
      <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-8">
        <Link href="/" className="font-black text-2xl tracking-tight text-gray-900">
          amazon<span className="text-amazon-orange text-sm">.com</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Checkout</h1>
        <div className="flex items-center text-xs text-gray-600 gap-1">
          <Lock className="h-4 w-4 text-green-700" />
          <span>Secure Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Accordion Steps (Cols 1-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Shipping Address */}
          <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="flex h-6 w-6 rounded-full bg-amazon-nav text-white text-xs items-center justify-center font-bold">
                  1
                </span>
                Shipping Address
              </h2>
              {activeStep > 1 && (
                <button
                  onClick={() => setActiveStep(1)}
                  className="text-xs font-semibold text-amazon-link hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {activeStep === 1 ? (
              <div
                className="mt-4 space-y-4"
                onKeyDown={() => setHasUserTyped(true)}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="First and last name"
                      className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Street address or P.O. Box"
                      className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="e.g. 98109"
                      className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Country</label>
                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="w-full sm:w-1/2 rounded border border-gray-400 bg-white px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    disabled={!isAddressFormValid}
                    onClick={() => setActiveStep(2)}
                    className={`rounded bg-amazon-yellow hover:bg-amazon-yellowHover px-6 py-2 text-xs font-bold text-amazon-text shadow-sm transition ${
                      !isAddressFormValid ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Use this address
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-xs text-gray-600">
                <p className="font-semibold">{fullName}</p>
                <p>{street}, {city}, {state} {zipCode}, {selectedCountry}</p>
              </div>
            )}
          </div>

          {/* STEP 2: Payment Method */}
          <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="flex h-6 w-6 rounded-full bg-amazon-nav text-white text-xs items-center justify-center font-bold">
                  2
                </span>
                Payment Method
              </h2>
              {activeStep > 2 && (
                <button
                  onClick={() => setActiveStep(2)}
                  className="text-xs font-semibold text-amazon-link hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {activeStep === 2 ? (
              <div className="mt-4 space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-800">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="text-amazon-orange focus:ring-amazon-orange"
                    />
                    <span>Credit or Debit Card</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="text-amazon-orange focus:ring-amazon-orange"
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "netbanking"}
                      onChange={() => setPaymentMethod("netbanking")}
                      className="text-amazon-orange focus:ring-amazon-orange"
                    />
                    <span>Net Banking</span>
                  </label>
                </div>

                {paymentMethod === "card" && (
                  <div className="p-4 rounded border border-gray-200 bg-gray-50 space-y-3 max-w-md">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        Card Number (16 Digits)
                      </label>
                      <input
                        type="text"
                        maxLength={cardMaxLength}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full rounded border border-gray-300 px-3 py-1.5 text-xs font-mono focus:border-amazon-orange focus:outline-none bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full rounded border border-gray-300 px-3 py-1.5 text-xs font-mono focus:border-amazon-orange focus:outline-none bg-white"
                        />
                      </div>

                      <div className="relative">
                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1 mb-1">
                          <span>CVV</span>
                          <HelpCircle
                            className="h-3.5 w-3.5 text-gray-500 cursor-pointer"
                            onMouseEnter={() => setShowCvvTooltip(true)}
                            onMouseLeave={() => {
                              if (!UI_CONFIG.persistHelpTooltipOnLeave) {
                                setShowCvvTooltip(false);
                              }
                            }}
                          />
                        </label>

                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          className="w-full rounded border border-gray-300 px-3 py-1.5 text-xs font-mono focus:border-amazon-orange focus:outline-none bg-white"
                        />

                        {showCvvTooltip && (
                          <div className="absolute top-full left-0 mt-1 w-52 bg-gray-900 text-white text-[11px] p-2.5 rounded shadow-xl z-30">
                            The 3- or 4-digit code on the back of your credit/debit card.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => setActiveStep(3)}
                    className="rounded bg-amazon-yellow hover:bg-amazon-yellowHover px-6 py-2 text-xs font-bold text-amazon-text shadow-sm"
                  >
                    Use this payment method
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-xs text-gray-600">
                <span className="font-semibold capitalize">Payment: </span>
                {paymentMethod === "card"
                  ? `Ending in ${cardNumber.slice(-4) || "4242"}`
                  : paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Net Banking"}
              </div>
            )}
          </div>

          {/* STEP 3: Review Items and Shipping */}
          <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="flex h-6 w-6 rounded-full bg-amazon-nav text-white text-xs items-center justify-center font-bold">
                3
              </span>
              Review Items and Shipping
            </h2>

            <div className="divide-y divide-gray-200">
              {items.map((it) => (
                <div key={it.productId} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={it.imageUrl} alt="" className="h-12 w-12 object-contain" />
                    <div>
                      <span className="font-semibold text-gray-800 line-clamp-1">
                        {it.title}
                      </span>
                      <span className="text-gray-500">Qty: {it.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    {displayCurrencySymbol}
                    {(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500">
                  By placing your order, you agree to Amazon&apos;s Conditions of Use and Privacy Notice.
                </p>
              </div>
              <button
                onClick={handlePlaceOrder}
                id="place-your-order-btn"
                className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-amazon-yellow hover:bg-amazon-yellowHover font-bold text-xs text-amazon-text shadow-sm transition"
              >
                {isSubmitting ? "Placing order..." : "Place Your Order"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary Card (Cols 9-12) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-gray-300 p-6 shadow-sm space-y-4">
          <button
            onClick={handlePlaceOrder}
            className="w-full py-2.5 px-4 rounded-full bg-amazon-yellow hover:bg-amazon-yellowHover font-bold text-xs text-amazon-text shadow-sm transition"
          >
            Place your order
          </button>

          <p className="text-[11px] text-gray-500 text-center">
            You can review and edit your order before placing it.
          </p>

          <div className="border-t border-gray-200 pt-3 space-y-2 text-xs">
            <h4 className="font-bold text-gray-900 text-sm">Order Summary</h4>

            <div className="flex justify-between text-gray-700">
              <span>Items ({items.reduce((acc, it) => acc + it.quantity, 0)}):</span>
              <span>
                {displayCurrencySymbol}
                {subtotal.toFixed(2)}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-700 font-semibold">
                <span>Promotional Discount:</span>
                <span>
                  -{displayCurrencySymbol}
                  {discount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-gray-700">
              <span>Shipping & handling:</span>
              <span>{displayCurrencySymbol}0.00</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Estimated Tax (8%):</span>
              <span>
                {displayCurrencySymbol}
                {tax.toFixed(2)}
              </span>
            </div>

            <div className="border-t border-gray-300 pt-2 flex justify-between text-base font-bold text-amazon-price">
              <span>Order Total:</span>
              <span>
                {displayCurrencySymbol}
                {finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Promo Code / Gift Card Section */}
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <h4 className="font-bold text-gray-800 text-xs">
              Gift Cards & Promotional Codes
            </h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                placeholder="Enter code"
                className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-xs uppercase focus:border-amazon-orange focus:outline-none focus:ring-1 focus:ring-amazon-orange"
              />
              <button
                type="submit"
                disabled={isApplyingPromo}
                className="rounded border border-gray-400 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-xs font-bold text-gray-800 transition disabled:opacity-50"
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

      {treasureCode && (
        <TreasureCelebrationModal
          isOpen={isTreasureModalOpen}
          onClose={() => setIsTreasureModalOpen(false)}
          title="FESTIVE TECHFEST SPONSOR CODE ACTIVATED!"
          subtitle="You unlocked the special 20% campus partner coupon and found a secret treasure!"
          treasureCode={treasureCode}
        />
      )}
    </div>
  );
}
