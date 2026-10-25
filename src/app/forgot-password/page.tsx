"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("customer@amazon.local");
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetLink(data.resetLink);
        setMessage("Password recovery link generated below:");
      } else {
        setMessage(data.error || "Failed to initiate password reset.");
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 flex flex-col items-center text-amazon-text">
      <Link href="/" className="mb-6">
        <span className="font-black text-3xl tracking-tight text-gray-900">
          amazon<span className="text-amazon-orange text-base font-semibold">.com</span>
        </span>
      </Link>

      <div className="w-full max-w-sm rounded-lg border border-gray-300 p-8 shadow-sm space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Password assistance</h1>
        <p className="text-xs text-gray-600 leading-relaxed">
          Enter the email address associated with your Amazon account. We&apos;ll send you a password recovery link.
        </p>

        {resetLink && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <span>Recovery link ready:</span>
            </div>
            <Link
              href={resetLink}
              className="block font-mono text-[11px] text-blue-700 underline break-all"
            >
              Click here to reset password &rarr;
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-800 block mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 rounded-md bg-amazon-yellow hover:bg-amazon-yellowHover font-bold text-xs text-amazon-text shadow-sm transition"
          >
            {isSubmitting ? "Generating link..." : "Continue"}
          </button>
        </form>

        <div className="border-t border-gray-200 pt-4 text-xs text-gray-600">
          Remember your password?{" "}
          <Link href="/login" className="text-amazon-link hover:underline font-bold">
            Sign in &rsaquo;
          </Link>
        </div>
      </div>
    </div>
  );
}
