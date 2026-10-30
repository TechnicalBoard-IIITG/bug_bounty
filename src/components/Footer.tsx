"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UI_CONFIG } from "@/lib/uiDefects";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  // EASY_13: Privacy Policy links to non-existent route
  const privacyPolicyHref = "/privacy-policy-404";

  // EASY_15: Social links target attribute inverted
  const externalTarget = UI_CONFIG.invertFooterLinkTargets ? "_self" : "_blank";

  return (
    <footer className="bg-amazon-footer text-white text-xs mt-12 select-none">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-white py-3.5 text-center font-bold text-xs tracking-tight transition cursor-pointer"
      >
        Back to top
      </button>

      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700">
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-white mb-2">Get to Know Us</h4>
          <ul className="space-y-1.5 text-gray-300">
            <li><Link href="/about" className="hover:underline">About Amazon</Link></li>
            <li><span className="text-gray-400">Careers &amp; Culture</span></li>
            <li><span className="text-gray-400">Press Center</span></li>
            <li><span className="text-gray-400">Amazon Science</span></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-sm text-white mb-2">Make Money with Us</h4>
          <ul className="space-y-1.5 text-gray-300">
            <li><span className="text-gray-400">Sell products on Amazon</span></li>
            <li><span className="text-gray-400">Sell on Amazon Business</span></li>
            <li><span className="text-gray-400">Become an Affiliate</span></li>
            <li><span className="text-gray-400">Advertise Your Products</span></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-sm text-white mb-2">Amazon Payment Products</h4>
          <ul className="space-y-1.5 text-gray-300">
            <li><span className="text-gray-400">Amazon Business Card</span></li>
            <li><span className="text-gray-400">Shop with Points</span></li>
            <li><span className="text-gray-400">Reload Your Balance</span></li>
            <li><span className="text-gray-400">Amazon Currency Converter</span></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-sm text-white mb-2">Let Us Help You</h4>
          <ul className="space-y-1.5 text-gray-300">
            <li><Link href="/account" className="hover:underline">Your Account</Link></li>
            <li><Link href="/orders" className="hover:underline">Your Orders</Link></li>
            <li><Link href="/faq" className="hover:underline">Shipping Rates &amp; Policies</Link></li>
            <li><Link href="/faq" className="hover:underline">Returns &amp; Replacements</Link></li>
            <li><Link href="/contact" className="hover:underline">Help &amp; Customer Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Social Media & Newsletter Row */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-800">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-[11px] text-gray-400">Connect with Us</span>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-300">
            <a href="https://facebook.com" target={externalTarget} className="hover:text-amazon-orange hover:underline">
              Facebook
            </a>
            <a href="https://twitter.com" target={externalTarget} className="hover:text-amazon-orange hover:underline">
              Twitter / X
            </a>
            <a href="https://instagram.com" target={externalTarget} className="hover:text-amazon-orange hover:underline">
              Instagram
            </a>
          </div>
        </div>

        <div className="w-full md:w-auto text-center md:text-right">
          <span className="text-[11px] font-bold text-gray-300 block mb-1">
            Subscribe to Amazon Daily Deals
          </span>
          <p className="text-[10px] text-gray-400 mb-2">
            Get exclusive email alerts on lightning discounts and newly seeded products.
          </p>
          <form onSubmit={handleSubscribe} className="flex max-w-sm mx-auto md:mx-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-3 py-1.5 bg-white text-gray-800 rounded-l text-xs focus:outline-none flex-1"
            />
            <button
              type="submit"
              className="bg-amazon-yellow hover:bg-amazon-yellowHover text-amazon-text font-bold px-4 py-1.5 rounded-r text-xs transition"
            >
              {subscribed ? "Subscribed!" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      {/* Sub-Footer Legal Notice */}
      <div className="bg-[#131a22] py-8 text-center text-[11px] text-gray-400 space-y-2">
        <div className="flex justify-center flex-wrap gap-4 text-gray-300">
          <Link href="/about" className="hover:underline">Conditions of Use</Link>
          <Link href={privacyPolicyHref} className="hover:underline">Privacy Notice</Link>
          <Link href="/faq" className="hover:underline">Consumer Health Data Privacy Disclosure</Link>
          <Link href="/contact" className="hover:underline">Your Ads Privacy Choices</Link>
        </div>
        <p>&copy; 1996-2026, Amazon.com, Inc. or its affiliates &bull; Entropy 2K26 QA Simulation Target</p>
      </div>

      {/* The ONLY Authentic Inspect Tool QA Comment */}
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<!-- [INTERNAL DEV NOTICE - QA ENVIRONMENT 2026] Build Revision: 0x9f82b7a-prod. Staging release signed. TREASURE CODE: TREASURE-DOM-INSPECT -->",
        }}
      />
    </footer>
  );
};
