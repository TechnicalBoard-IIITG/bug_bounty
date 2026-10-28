"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        login(data.token, data.user);
        router.push("/account");
      } else {
        setErrorMessage(data.error || "Registration failed");
      }
    } catch {
      setErrorMessage("Network error during registration.");
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
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-gray-800 block mb-1">Your name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and last name"
              className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Mobile number or email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Re-enter password</label>
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
            {isSubmitting ? "Creating account..." : "Continue"}
          </button>

          <p className="text-[11px] text-gray-500 leading-relaxed pt-2">
            By creating an account, you agree to Amazon&apos;s Conditions of Use and Privacy Notice.
          </p>
        </form>

        <div className="border-t border-gray-200 pt-4 text-xs text-gray-600">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-amazon-link hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
