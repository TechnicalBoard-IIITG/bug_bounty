"use client";

import React from "react";
import Link from "next/link";
import { Package, Lock, MapPin, User, HelpCircle, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, isLoading } = useAuth();

  const accountCards = [
    {
      title: "Your Orders",
      desc: "Track, return, or buy things again",
      icon: Package,
      link: "/orders",
    },
    {
      title: "Your Addresses",
      desc: "Edit, remove or set default shipping addresses",
      icon: MapPin,
      link: "/account/addresses",
    },
    {
      title: "Profile & Avatar",
      desc: "Manage profile settings, picture, and user preferences",
      icon: User,
      link: "/account/profile",
    },
    {
      title: "Login & Security",
      desc: "Edit login, name, mobile number, and password",
      icon: Lock,
      link: "/forgot-password",
    },
    {
      title: "Customer Support FAQ",
      desc: "Browse help topics, return policies, and shipping FAQs",
      icon: HelpCircle,
      link: "/faq",
    },
    {
      title: "Contact Customer Care",
      desc: "Reach out to our 24/7 dedicated customer support team",
      icon: Mail,
      link: "/contact",
    },
  ];

  if (!isLoading && !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-amazon-text text-center space-y-6">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 space-y-4">
          <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amazon-orange">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Sign in to view your account</h2>
          <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
            Manage your orders, addresses, payment settings, and public profile. Please sign in to access your account dashboard.
          </p>
          <div className="pt-2 space-y-2 max-w-xs mx-auto">
            <Link
              href="/login?redirect=/account"
              className="block w-full py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-xs rounded-md shadow-sm transition"
            >
              Sign in to your account
            </Link>
            <Link
              href="/register"
              className="block w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded-md border border-gray-300 transition"
            >
              New customer? Start here.
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-amazon-text space-y-6">
      <div className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Your Account</h1>
        <p className="text-xs text-gray-500">
          Logged in as <span className="font-bold text-gray-800">{user?.name || "Customer"}</span> {user?.email ? `(${user.email})` : ""} &bull; Role: <span className="uppercase font-semibold text-amazon-orange">{user?.role || "customer"}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {accountCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.link}
              className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm hover:border-amazon-orange hover:shadow-md transition flex items-start gap-4 group"
            >
              <div className="p-3 bg-gray-100 rounded-full group-hover:bg-amber-100 transition shrink-0">
                <Icon className="h-6 w-6 text-gray-700 group-hover:text-amazon-orange transition" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-amazon-orange transition">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
