"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { isDefectActive } from "@/config/defects.config";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Order Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // EASY_11: Required Form Validation Enforcement
    // Submitting the Contact Us form with mandatory "Email" input left blank
    // bypasses client-side validation without displaying a warning
    if (!isDefectActive("EASY_11_CONTACT_EMAIL_VALIDATION_BYPASS")) {
      if (!email.trim() || !email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    if (!name.trim() || !message.trim()) {
      setError("Please fill out your name and message.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-amazon-text space-y-6">
      <div className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Mail className="h-6 w-6 text-amazon-orange" />
          Contact Amazon Customer Care
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Have an issue with your order or questions about our policies? We&apos;re here to help 24/7.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center space-y-3 shadow-sm">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">Message Dispatched!</h3>
          <p className="text-xs text-gray-600">
            Thank you, {name}. A customer service representative will respond shortly
            {email ? ` at ${email}` : ""}.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setMessage("");
            }}
            className="mt-4 rounded bg-amazon-yellow px-4 py-1.5 text-xs font-bold"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm space-y-4 text-xs"
        >
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="font-bold text-gray-800 block mb-1">Your Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded border border-gray-400 px-3 py-1.5 focus:border-amazon-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">
              Email Address * (Mandatory)
            </label>
            {/* Notice: No HTML5 'required' attribute when EASY_11 is active to demonstrate client validation bypass */}
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded border border-gray-400 px-3 py-1.5 focus:border-amazon-orange focus:outline-none"
            />

          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Topic / Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded border border-gray-400 bg-white px-3 py-1.5 focus:border-amazon-orange focus:outline-none"
            >
              <option value="Order Inquiry">Where&apos;s my stuff / Order tracking</option>
              <option value="Return / Refund">Returns, replacements & refunds</option>
              <option value="Payment Issue">Payment, charges & invoices</option>
              <option value="Defect Report">Bug report or website feedback</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-gray-800 block mb-1">Message *</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your inquiry with as much detail as possible..."
              className="w-full rounded border border-gray-400 px-3 py-1.5 focus:border-amazon-orange focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="rounded bg-amazon-yellow hover:bg-amazon-yellowHover px-6 py-2 font-bold text-amazon-text shadow-sm transition"
            >
              Submit Contact Form
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
