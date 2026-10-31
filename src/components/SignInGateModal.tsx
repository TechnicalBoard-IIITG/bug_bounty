"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, UserCheck, ShieldCheck, X, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const SignInGateModal: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only check once auth rehydration is complete
    if (isLoading) return;

    if (!user) {
      // Check if user has already dismissed the first-arrival modal in this session
      const hasDismissed = sessionStorage.getItem("amazon_signin_gate_dismissed");
      if (!hasDismissed) {
        // Small delay so page renders nicely first
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } else {
      setIsOpen(false);
    }
  }, [user, isLoading]);

  if (!isOpen || user) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("amazon_signin_gate_dismissed", "true");
    setIsOpen(false);
  };

  const handleSignIn = () => {
    sessionStorage.setItem("amazon_signin_gate_dismissed", "true");
    setIsOpen(false);
    router.push("/login");
  };

  const handleRegister = () => {
    sessionStorage.setItem("amazon_signin_gate_dismissed", "true");
    setIsOpen(false);
    router.push("/register");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden text-amazon-text">
        {/* Top Amazon Header Strip */}
        <div className="bg-[#131921] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-white">
              amazon<span className="text-amazon-orange text-xs font-semibold">.com</span>
            </span>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 ml-2">
              Entropy 2K26
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white transition p-1 rounded hover:bg-white/10"
            title="Dismiss and browse as guest"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amazon-orange mb-1">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              To place orders, submit reviews, and ensure your bug hunting progress is completely isolated to your team, please sign in first.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-[11px] text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="h-4 w-4 text-amazon-orange shrink-0" />
              <span>Strict User &amp; Team Isolation Active:</span>
            </div>
            <p className="text-amber-800 leading-normal pl-5">
              Orders, addresses, and account profiles are privately scoped per user. Only public product reviews and comments are shared across participants.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSignIn}
              className="w-full py-2.5 px-4 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 text-xs font-bold rounded-md shadow-sm transition flex items-center justify-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Sign In to Your Account
            </button>

            <button
              onClick={handleRegister}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-md border border-gray-300 transition"
            >
              New participant? Create account
            </button>
          </div>

          <div className="text-center pt-1 border-t border-gray-100">
            <button
              onClick={handleDismiss}
              className="text-xs text-amazon-link hover:underline font-medium"
            >
              Continue browsing catalog as guest &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
