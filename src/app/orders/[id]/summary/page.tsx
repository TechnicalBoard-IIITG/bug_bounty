"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Printer } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

export default function OrderSummaryPage() {
  const params = useParams();
  const id = (params.id as string) || "";
  const currency = useCartStore((s) => s.currency);

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
        }
      })
      .catch((err) => console.error("Order fetch error:", err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-amazon-text">
        <p className="text-xs text-gray-500 font-semibold">Loading order confirmation...</p>
      </div>
    );
  }

  const orderNum = order?.orderNumber || id;
  const total = order?.total || 149.99;
  const items = order?.items || [
    {
      id: "it-1",
      title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
      quantity: 1,
      unitPrice: 348.0,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-amazon-text space-y-6">
      {/* Thank you hero banner */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex items-start gap-4">
        <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-gray-900">
            Thank you, your order has been placed!
          </h1>
          <p className="text-xs text-gray-600">
            An email confirmation has been sent to your account email address.
          </p>
          <div className="pt-2 text-xs font-semibold text-gray-800">
            Order #<span className="font-mono text-amazon-price">{orderNum}</span>
          </div>
        </div>
      </div>

      {/* Delivery Estimate Box */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-amazon-orange" />
            <h2 className="text-base font-bold text-gray-900">
              Guaranteed Delivery: Tomorrow by 8 PM
            </h2>
          </div>
          <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200">
            Status: {order?.status || "Processing"}
          </span>
        </div>

        {/* Itemized Order List */}
        <div className="divide-y divide-gray-200">
          {items.map((it: any, idx: number) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <img src={it.imageUrl} alt="" className="h-14 w-14 object-contain" />
                <div>
                  <h4 className="font-semibold text-gray-800 line-clamp-1">{it.title}</h4>
                  <p className="text-gray-500">Qty: {it.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">
                {formatPrice(it.unitPrice * it.quantity, currency)}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="border-t pt-4 flex flex-wrap gap-4 items-center justify-between text-xs">
          <div className="flex gap-4">
            <Link
              href="/orders"
              className="text-amazon-link hover:underline font-semibold flex items-center gap-1"
            >
              View all orders <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => window.print()}
              className="text-gray-600 hover:text-black flex items-center gap-1"
            >
              <Printer className="h-3.5 w-3.5" /> Print receipt
            </button>
          </div>

          <Link
            href="/"
            className="rounded bg-amazon-yellow hover:bg-amazon-yellowHover px-5 py-2 font-bold text-amazon-text shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
