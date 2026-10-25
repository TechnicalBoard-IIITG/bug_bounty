"use client";

import React, { useState } from "react";
import { isDefectActive } from "@/config/defects.config";
import { Cookie, X } from "lucide-react";

export const CookieBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  // EASY_14: Cookie Banner Z-Index Stacking
  // The fixed cookie notification banner renders over the footer newsletter submit button, intercepting pointer clicks
  const isBugActive = isDefectActive("EASY_14_COOKIE_BANNER_ZINDEX_OVERLAY");

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 text-white border-t border-gray-700 shadow-2xl p-4 transition-all duration-300 ${
        isBugActive
          ? "pointer-events-auto min-h-[110px]"
          : "pointer-events-auto"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie className="h-6 w-6 text-amazon-yellow shrink-0" />
          <p className="text-xs text-gray-300">
            We use cookies to analyze site traffic, personalize content, and serve targeted advertisements.
            By clicking &quot;Accept All&quot;, you consent to our use of cookies per our Privacy Policy.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsDismissed(true)}
            className="rounded border border-gray-500 hover:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-300"
          >
            Preferences
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="rounded bg-amazon-yellow hover:bg-amazon-yellowHover px-5 py-1.5 text-xs font-bold text-amazon-text shadow-sm"
          >
            Accept All Cookies
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-gray-400 hover:text-white p-1"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
