"use client";

import React from "react";
import Link from "next/link";
import { UserCheck, Shield, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const SignInPromptBanner: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-md p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-full bg-emerald-600 text-white shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-emerald-900">Signed in as {user.name}</span>{" "}
            <span className="text-emerald-700">({user.email})</span>
            <p className="text-[11px] text-emerald-800">
              Your orders, addresses, and team testing progress are strictly isolated to your account.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-xs">
          <Link
            href="/orders"
            className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
          >
            Your Orders &rarr;
          </Link>
          <Link
            href="/account"
            className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
          >
            Account Settings &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300 rounded-md p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-amber-950">
      <div className="flex items-start sm:items-center gap-3">
        <div className="p-2 rounded-full bg-amazon-orange text-white shrink-0 mt-0.5 sm:mt-0">
          <Shield className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            Sign in for the best experience &bull; Entropy 2K26 Contestant Account
          </h4>
          <p className="text-xs text-gray-600">
            Signing in is required before placing orders, writing customer reviews, or accessing account details. User sessions and order records are completely isolated per account.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Link
          href="/login"
          className="px-5 py-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-xs rounded-md shadow-sm transition whitespace-nowrap flex items-center gap-1.5"
        >
          <UserCheck className="h-3.5 w-3.5" />
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs rounded-md border border-gray-300 shadow-2xs transition whitespace-nowrap"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
};
