"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const FAQS = [
  {
    id: "faq-1",
    question: "How do I track my Amazon package?",
    answer:
      "You can track your package by navigating to 'Your Orders' in your account. Select the order you want to track and click 'Track Package' to view delivery milestones and carrier updates.",
  },
  {
    id: "faq-2",
    question: "What is Amazon's standard return policy?",
    answer:
      "Most items shipped from Amazon.com can be returned within 30 days of receipt of delivery for a full refund or replacement. Items must be in new, unworn, or original condition.",
  },
  {
    id: "faq-3",
    question: "How does Amazon Prime One-Day and Same-Day delivery work?",
    answer:
      "Prime members enjoy free Two-Day, One-Day, and Same-Day delivery on qualifying items. Qualifying orders placed before the cutoff time arrive on the specified delivery estimate.",
  },
  {
    id: "faq-4",
    question: "How do I apply promotional codes or gift cards to my cart?",
    answer:
      "During checkout or on the Shopping Cart page, enter your promotional claim code into the 'Gift Cards & Promotional Codes' box and click 'Apply'. Discounts are deducted immediately.",
  },
  {
    id: "faq-5",
    question: "What should I do if an item arrives damaged or defective?",
    answer:
      "Go to 'Your Orders', find the item, and select 'Return or replace items'. Follow the on-screen instructions to select the reason for return and receive an instant prepaid return shipping label.",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const handleAccordionClick = (id: string) => {
    setOpenId(id);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-amazon-text space-y-6">
      <div className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-amazon-orange" />
          Customer Support & Help FAQ
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Quick answers to frequently asked questions about shipping, returns, Prime benefits, and orders.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => handleAccordionClick(faq.id)}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition select-none"
              >
                <span className="font-bold text-sm text-gray-900">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-600 shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-600 shrink-0 ml-2" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 animate-in fade-in duration-150">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 text-center space-y-2 text-xs">
        <h4 className="font-bold text-gray-800">Still have questions?</h4>
        <p className="text-gray-500">Our customer support specialists are ready to assist you.</p>
        <Link
          href="/contact"
          className="inline-block mt-2 rounded bg-amazon-yellow hover:bg-amazon-yellowHover px-5 py-1.5 font-bold text-amazon-text shadow-sm"
        >
          Contact Customer Service
        </Link>
      </div>
    </div>
  );
}
