"use client";

import React, { useState } from "react";
import Link from "next/link";
import { isDefectActive } from "@/config/defects.config";

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // EASY_13: Footer Legal Navigation Target
  // Clicking the "Privacy Policy" link in footer navigation routes to non-existent URL and renders a 404 page
  const privacyPolicyHref = isDefectActive("EASY_13_FOOTER_PRIVACY_POLICY_404")
    ? "/privacy-policy-statement"
    : "/about";

  // EASY_15: Navigation Target Attribute Logic
  // Internal footer links open in a new tab (target="_blank"), while external social links navigate away from current window (target="_self")
  const isTargetInverted = isDefectActive("EASY_15_FOOTER_TARGET_ATTRIBUTE_INVERT");
  const internalTarget = isTargetInverted ? "_blank" : "_self";
  const externalTarget = isTargetInverted ? "_self" : "_blank";

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-amazon-subnav text-white text-xs select-none">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-white py-3.5 text-center text-xs font-semibold tracking-wide transition"
      >
        Back to top
      </button>

      {/* 4-Column Navigation Links */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-300">
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Get to Know Us</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/about" target={internalTarget} className="hover:underline">
                About Amazon
              </Link>
            </li>
            <li>
              <Link href="/contact" target={internalTarget} className="hover:underline">
                Careers & Culture
              </Link>
            </li>
            <li>
              <Link href="/about" target={internalTarget} className="hover:underline">
                Press Center
              </Link>
            </li>
            <li>
              <Link href="/about" target={internalTarget} className="hover:underline">
                Amazon Science
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Make Money with Us</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/s?q=sell" target={internalTarget} className="hover:underline">
                Sell products on Amazon
              </Link>
            </li>
            <li>
              <Link href="/s?q=business" target={internalTarget} className="hover:underline">
                Sell on Amazon Business
              </Link>
            </li>
            <li>
              <Link href="/s?q=affiliate" target={internalTarget} className="hover:underline">
                Become an Affiliate
              </Link>
            </li>
            <li>
              <Link href="/s?q=advertise" target={internalTarget} className="hover:underline">
                Advertise Your Products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Amazon Payment Products</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/account" target={internalTarget} className="hover:underline">
                Amazon Business Card
              </Link>
            </li>
            <li>
              <Link href="/cart" target={internalTarget} className="hover:underline">
                Shop with Points
              </Link>
            </li>
            <li>
              <Link href="/account" target={internalTarget} className="hover:underline">
                Reload Your Balance
              </Link>
            </li>
            <li>
              <Link href="/cart" target={internalTarget} className="hover:underline">
                Amazon Currency Converter
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Let Us Help You</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/account" target={internalTarget} className="hover:underline">
                Your Account
              </Link>
            </li>
            <li>
              <Link href="/orders" target={internalTarget} className="hover:underline">
                Your Orders
              </Link>
            </li>
            <li>
              <Link href="/faq" target={internalTarget} className="hover:underline">
                Shipping Rates & Policies
              </Link>
            </li>
            <li>
              <Link href="/faq" target={internalTarget} className="hover:underline">
                Returns & Replacements
              </Link>
            </li>
            <li>
              <Link href="/faq" target={internalTarget} className="hover:underline">
                Help & Customer Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media Links with EASY_15 defect */}
      <div className="border-t border-gray-700 py-6 text-center">
        <p className="text-xs text-gray-400 mb-2 font-medium">Connect with Us</p>
        <div className="flex justify-center gap-6 text-xs text-gray-300">
          <a
            href="https://facebook.com/amazon"
            target={externalTarget}
            rel="noopener noreferrer"
            className="hover:underline text-amazon-accent"
          >
            Facebook
          </a>
          <a
            href="https://twitter.com/amazon"
            target={externalTarget}
            rel="noopener noreferrer"
            className="hover:underline text-amazon-accent"
          >
            Twitter / X
          </a>
          <a
            href="https://instagram.com/amazon"
            target={externalTarget}
            rel="noopener noreferrer"
            className="hover:underline text-amazon-accent"
          >
            Instagram
          </a>
        </div>
      </div>

      {/* Footer Newsletter Submit Section (Target of Easy 14 Cookie Banner Z-Index Overlay) */}
      <div className="bg-[#131a22] border-t border-gray-800 py-6 px-4 text-center">
        <div className="max-w-md mx-auto">
          <h5 className="font-bold text-white text-xs mb-1">Subscribe to Amazon Daily Deals</h5>
          <p className="text-[11px] text-gray-400 mb-3">
            Get exclusive email alerts on lightning discounts and newly seeded products.
          </p>
          {subscribed ? (
            <p className="text-xs text-green-400 font-semibold">Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 justify-center">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="rounded px-3 py-1.5 text-xs text-amazon-text bg-white w-64 focus:outline-none"
              />
              <button
                type="submit"
                id="newsletter-submit-btn"
                className="rounded bg-amazon-yellow hover:bg-amazon-yellowHover text-amazon-text font-bold px-4 py-1.5 text-xs transition"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Legal Section */}
      <div className="bg-amazon-nav py-8 text-center text-[11px] text-gray-400 space-y-2 border-t border-gray-800">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/about" target={internalTarget} className="hover:underline">
            Conditions of Use
          </Link>
          {/* Privacy Policy link with EASY_13 404 defect */}
          <Link href={privacyPolicyHref} target={internalTarget} className="hover:underline text-gray-300">
            Privacy Policy
          </Link>
          <Link href="/about" target={internalTarget} className="hover:underline">
            Consumer Health Data Privacy Disclosure
          </Link>
          <Link href="/about" target={internalTarget} className="hover:underline">
            Your Ads Privacy Choices
          </Link>
        </div>
        <p>© 1996–2026, Amazon.com, Inc. or its affiliates — Entropy 2K26 QA Simulation Target</p>
      </div>
    </footer>
  );
};
