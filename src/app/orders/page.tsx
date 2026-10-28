"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, XCircle, CheckCircle2, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";

export default function OrdersPage() {
  const { user } = useAuth();
  const currency = useCartStore((s) => s.currency);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);

  const fetchOrders = () => {
    setIsLoading(true);
    fetch(`/api/orders?userId=${user?.id || ""}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          setOrders(data.orders);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId: string, currentStatus: string) => {
    const confirmCancel = confirm(
      `Are you sure you want to request cancellation for Order #${orderId} (Status: ${currentStatus})?`
    );
    if (!confirmCancel) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCancelMessage(data.message);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId || o.orderNumber === orderId ? { ...o, status: "Cancelled" } : o))
        );
      } else {
        alert(data.error || "Order cancellation failed.");
      }
    } catch (e) {
      console.error("Cancel order error:", e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-amazon-text space-y-6">
      <div className="flex items-center justify-between border-b border-gray-300 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-xs text-gray-500">Track packages, review items, or manage returns</p>
        </div>
      </div>

      {cancelMessage && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-md text-xs font-semibold flex items-center justify-between">
          <span>{cancelMessage}</span>
          <button onClick={() => setCancelMessage(null)} className="text-gray-500 hover:text-black">
            &times;
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-500">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">You have no orders yet</h3>
          <p className="text-xs text-gray-500 mt-1">Start browsing products to place your first order.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden text-xs"
            >
              {/* Order Card Header */}
              <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-gray-600">
                <div className="flex gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">
                      Order Placed
                    </span>
                    <span className="font-semibold text-gray-800">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">
                      Total
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatPrice(ord.total, currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">
                      Ship To
                    </span>
                    <span className="font-semibold text-amazon-link hover:underline cursor-pointer">
                      {user?.name || "Customer"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    Order # {ord.orderNumber || ord.id}
                  </span>
                  <Link
                    href={`/orders/${ord.id}/summary`}
                    className="text-amazon-link hover:underline font-semibold"
                  >
                    View order details
                  </Link>
                </div>
              </div>

              {/* Order Card Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {ord.status === "Delivered" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : ord.status === "Cancelled" ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-amazon-orange" />
                    )}
                    <h3 className="font-bold text-sm text-gray-900">
                      {ord.status === "Delivered"
                        ? "Delivered yesterday"
                        : ord.status === "Cancelled"
                        ? "Cancelled"
                        : "Preparing for shipment"}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      ord.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : ord.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-100">
                  {ord.items?.map((it: any, idx: number) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={it.imageUrl} alt="" className="h-12 w-12 object-contain" />
                        <div>
                          <h4 className="font-semibold text-gray-800">{it.title}</h4>
                          <span className="text-gray-500">Qty: {it.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        {formatPrice(it.unitPrice * it.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 flex justify-end gap-3">
                  {ord.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancelOrder(ord.orderNumber || ord.id, ord.status)}
                      className="rounded border border-red-300 text-red-700 hover:bg-red-50 px-4 py-1.5 text-xs font-semibold shadow-sm transition"
                    >
                      Cancel Order
                    </button>
                  )}
                  <Link
                    href="/"
                    className="rounded bg-amazon-yellow hover:bg-amazon-yellowHover px-4 py-1.5 text-xs font-bold text-amazon-text shadow-sm"
                  >
                    Buy it again
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
