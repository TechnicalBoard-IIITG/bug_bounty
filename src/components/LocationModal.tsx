"use client";

import React, { useState } from "react";
import { X, MapPin } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentZip: string;
  onSaveZip: (zip: string) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentZip,
  onSaveZip,
}) => {
  const [zipInput, setZipInput] = useState(currentZip);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b bg-gray-100 px-4 py-3">
          <h3 className="text-base font-bold text-amazon-text flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-700" />
            Choose your location
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 rounded-full p-1 hover:bg-gray-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Delivery options and delivery speeds may vary for different locations. Enter a US ZIP code or choose a country.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">Enter a US ZIP Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                placeholder="e.g. 98109"
                className="flex-1 rounded border border-gray-400 px-3 py-1.5 text-sm focus:border-amazon-orange focus:outline-none focus:ring-1 focus:ring-amazon-orange"
              />
              <button
                onClick={() => {
                  onSaveZip(zipInput || "98109");
                  onClose();
                }}
                className="rounded-md bg-amazon-yellow hover:bg-amazon-yellowHover px-4 py-1.5 text-xs font-semibold text-amazon-text shadow-sm transition"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center border-t border-gray-200 pt-3">
            <span className="bg-white px-2 text-xs text-gray-500">or ship outside the US</span>
          </div>

          <select
            className="w-full rounded border border-gray-400 bg-white px-3 py-2 text-xs text-gray-700 focus:border-amazon-orange focus:outline-none"
            defaultValue="US"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="IN">India</option>
          </select>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="rounded bg-amazon-yellow hover:bg-amazon-yellowHover px-6 py-1.5 text-xs font-bold text-amazon-text shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
