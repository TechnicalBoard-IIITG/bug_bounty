"use client";

import React from "react";
import Link from "next/link";
import { Building2, Globe, Heart, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-amazon-text space-y-8">
      <div className="border-b border-gray-300 pb-6 text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">About Amazon</h1>
        <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
          Guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-2">
          <Building2 className="h-6 w-6 text-amazon-orange" />
          <h3 className="text-sm font-bold text-gray-900">Who We Are</h3>
          <p className="text-gray-600 leading-relaxed">
            From two-day shipping to cloud computing, digital streaming, and artificial intelligence, we strive to have a positive impact on customers, employees, small businesses, and the world.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-2">
          <Globe className="h-6 w-6 text-amazon-orange" />
          <h3 className="text-sm font-bold text-gray-900">Global Reach</h3>
          <p className="text-gray-600 leading-relaxed">
            Connecting millions of buyers and sellers worldwide with local fulfillment centers, state-of-the-art logistics infrastructure, and sustainable supply chains.
          </p>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg text-center space-y-3">
        <h4 className="text-sm font-bold text-gray-900">Ready to explore products?</h4>
        <Link
          href="/"
          className="inline-block rounded bg-amazon-yellow hover:bg-amazon-yellowHover px-6 py-2 text-xs font-bold shadow-sm transition"
        >
          Go to Amazon Home
        </Link>
      </div>
    </div>
  );
}
