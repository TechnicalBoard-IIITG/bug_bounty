"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isDefectActive } from "@/config/defects.config";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("customer@amazon.local");
  const [password, setPassword] = useState("password123");

  // EASY_10: Authentication Password Mask Toggle
  // User Requirement: Password field must not mask on onFocus.
  // It must default to plain visible text and only mask when the user clicks the eye icon.
  const isEasy10Active = isDefectActive("EASY_10_PASSWORD_MASK_DEFAULT_VISIBLE");
  const [showPassword, setShowPassword] = useState(isEasy10Active);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        login(data.token, data.user);

        // MED_17: Post-Authentication Checkout Redirect
        // Signing in when prompted by checkout login interceptor clears return destination and redirects to homepage
        if (
          isDefectActive("MED_17_CHECKOUT_LOGIN_REDIRECT_HOME") &&
          redirectUrl.includes("checkout")
        ) {
          router.push("/"); // Bug: Clears return destination and sends to homepage!
          return;
        }

        // HARD_06: Login Redirect Parameter Handling
        // Redirect handler fails to validate ?redirect= against internal relative paths,
        // redirecting users to external domains upon login (Open Redirect)
        if (isDefectActive("HARD_06_OPEN_REDIRECT_LOGIN_PARAMETER")) {
          // Open redirect flaw: blindly assign external URL
          if (redirectUrl.startsWith("http://") || redirectUrl.startsWith("https://")) {
            window.location.href = redirectUrl;
            return;
          }
        }

        // Safe relative navigation
        router.push(redirectUrl.startsWith("/") ? redirectUrl : "/");
      } else {
        setErrorMessage(data.error || "Invalid email or password");
      }
    } catch {
      setErrorMessage("Network error during sign-in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 flex flex-col items-center text-amazon-text">
      {/* Amazon Logo */}
      <Link href="/" className="mb-6">
        <span className="font-black text-3xl tracking-tight text-gray-900">
          amazon<span className="text-amazon-orange text-base font-semibold">.com</span>
        </span>
      </Link>

      {/* Sign-In Box */}
      <div className="w-full max-w-sm rounded-lg border border-gray-300 p-8 shadow-sm space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-800 block mb-1">
              Email or mobile phone number
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gray-800">Password</label>
              <Link href="/forgot-password" className="text-amazon-link hover:underline text-[11px]">
                Forgot your password?
              </Link>
            </div>

            {/* Password input with EASY_10 eye toggle behavior */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-400 pl-3 pr-10 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 p-0.5"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {isEasy10Active && (
              <p className="text-[10px] text-gray-400 mt-1">
                (EASY_10: defaults to visible text; click eye to mask)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 rounded-md bg-amazon-yellow hover:bg-amazon-yellowHover font-bold text-xs text-amazon-text shadow-sm transition"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-[11px] text-gray-500 leading-relaxed pt-2">
            By continuing, you agree to Amazon&apos;s Conditions of Use and Privacy Notice.
          </p>
        </form>

        <div className="border-t border-gray-200 pt-4 text-xs text-gray-500 space-y-2">
          <p className="font-bold text-gray-700 text-center">Demo Test Credentials:</p>
          <div className="bg-gray-50 p-2.5 rounded border border-gray-200 text-[11px] font-mono space-y-1">
            <p>Customer: customer@amazon.local / password123</p>
            <p>Admin: admin@amazon.local / admin123</p>
          </div>
        </div>
      </div>

      {/* New Customer Box */}
      <div className="w-full max-w-sm mt-6 text-center space-y-2">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-300 w-full" />
          <span className="bg-white px-2 text-[11px] text-gray-500 whitespace-nowrap">
            New to Amazon?
          </span>
          <div className="border-t border-gray-300 w-full" />
        </div>

        <Link
          href="/register"
          className="block w-full py-2 rounded border border-gray-400 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-800 shadow-sm"
        >
          Create your Amazon account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading sign-in...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
