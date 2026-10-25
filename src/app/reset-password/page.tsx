"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";
import { isDefectActive } from "@/config/defects.config";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "secret-recovery-token-12345";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCount, setUseCount] = useState(0);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatusMessage({ text: "Passwords do not match", isError: true });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const nextCount = useCount + 1;
        setUseCount(nextCount);
        setStatusMessage({
          text: `Success! Password changed. This token has been used ${nextCount} time(s). (HARD_05 allows infinite re-use).`,
          isError: false,
        });
      } else {
        setStatusMessage({ text: data.error || "Password reset failed", isError: true });
      }
    } catch {
      setStatusMessage({ text: "Network error during password reset.", isError: true });
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
        <h1 className="text-2xl font-bold text-gray-900">Create new password</h1>
        <p className="text-xs text-gray-600">
          We&apos;ll ask for this password whenever you sign in.
        </p>

        {isDefectActive("HARD_05_PASSWORD_RESET_TOKEN_REUSABLE") && (
          <div className="bg-red-50 border border-red-300 text-red-800 p-2.5 rounded text-[11px] font-semibold flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>HARD_05 Active: Recovery token is never invalidated upon password change.</span>
          </div>
        )}

        {statusMessage && (
          <div
            className={`p-3 rounded text-xs flex items-center gap-2 ${
              statusMessage.isError
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {statusMessage.isError ? (
              <AlertCircle className="h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-800 block mb-1">New password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Re-enter new password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 rounded-md bg-amazon-yellow hover:bg-amazon-yellowHover font-bold text-xs text-amazon-text shadow-sm transition"
          >
            {isSubmitting ? "Updating..." : "Save changes and sign in"}
          </button>
        </form>

        <div className="border-t border-gray-200 pt-4 text-xs text-gray-600">
          <Link href="/login" className="text-amazon-link hover:underline font-bold">
            Back to sign in &rsaquo;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading reset page...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
