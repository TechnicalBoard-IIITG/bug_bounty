"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, X } from "lucide-react";

interface TreasureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  treasureCode: string;
}

export const TreasureCelebrationModal: React.FC<TreasureModalProps> = ({
  isOpen,
  onClose,
  title = "SECRET TREASURE DISCOVERED!",
  subtitle = "Congratulations! You found a hidden TechFest Easter Egg.",
  treasureCode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(treasureCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#131921] to-[#232f3e] text-white border-2 border-[#febd69] rounded-xl shadow-2xl p-6 overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#febd69]/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-[#febd69] mb-3">
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="text-xs font-bold tracking-widest uppercase">Secret Easter Egg Unlocked</span>
        </div>

        <h3 className="text-xl font-extrabold text-white mb-2">{title}</h3>
        <p className="text-xs text-gray-300 mb-5 leading-relaxed">{subtitle}</p>

        <div className="bg-black/50 border border-[#febd69]/40 rounded-lg p-4 mb-5 text-center">
          <span className="text-[11px] font-semibold text-gray-400 block mb-1">
            ENTER THIS CODE IN THE SUBMISSION PORTAL:
          </span>
          <div className="font-mono text-lg font-black tracking-wider text-[#febd69] select-all py-1">
            {treasureCode}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-4 bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-bold text-xs rounded-md shadow flex items-center justify-center space-x-2 transition"
          >
            {copied ? <Check className="w-4 h-4 text-green-800" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "COPIED TO CLIPBOARD!" : "COPY TREASURE CODE"}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-white font-bold text-xs rounded-md transition"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};
