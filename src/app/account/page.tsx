"use client";

import React from "react";
import Link from "next/link";
import { Package, Lock, MapPin, User, HelpCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user } = useAuth();

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
      title: "Admin Console",
      desc: "Back-office administration and system metrics (Hard 3)",
      icon: ShieldCheck,
      link: "/admin/users",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-amazon-text space-y-6">
      <div className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Your Account</h1>
        <p className="text-xs text-gray-500">
          Logged in as <span className="font-bold text-gray-800">{user?.name || "John Customer"}</span> ({user?.email || "customer@amazon.local"}) &bull; Role: <span className="uppercase font-semibold text-amazon-orange">{user?.role || "customer"}</span>
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
