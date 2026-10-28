"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, MapPin, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AddressItem {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Address Form
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formStreet, setFormStreet] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formState, setFormState] = useState("");
  const [formZip, setFormZip] = useState("");

  const fetchAddresses = () => {
    setIsLoading(true);
    fetch(`/api/addresses?userId=${user?.id || ""}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.addresses) setAddresses(data.addresses);
      })
      .catch((err) => console.error("Addresses fetch error:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleDeleteAddress = async (index: number) => {
    if (addresses.length === 0) return;

    const targetId = addresses[index]?.id;
    if (!targetId) return;

    const confirmDelete = confirm(`Are you sure you want to remove this address?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/addresses/${targetId}?userId=${user?.id || ""}`, { method: "DELETE" });
      const data = await res.json();
      const deletedId = data.deletedId || targetId;
      setAddresses((prev) => prev.filter((a) => a.id !== deletedId));
    } catch (e) {
      console.error("Delete address failed:", e);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || "guest",
          fullName: formName,
          street: formStreet,
          city: formCity,
          state: formState,
          pincode: formZip,
          country: "United States",
          isDefault: addresses.length === 0,
        }),
      });
      const data = await res.json();
      if (data.success && data.address) {
        setAddresses([...addresses, data.address]);
        setIsAddFormOpen(false);
        setFormName("");
        setFormStreet("");
        setFormCity("");
        setFormState("");
        setFormZip("");
      }
    } catch (e) {
      console.error("Add address error:", e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-amazon-text space-y-6">
      <div className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link href="/account" className="hover:underline">
          Your Account
        </Link>
        <span>&rsaquo;</span>
        <span className="text-gray-800 font-semibold">Your Addresses</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Your Addresses</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Address Card */}
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-gray-500 hover:bg-gray-50/50 transition h-64 group"
        >
          <Plus className="h-10 w-10 text-gray-400 group-hover:text-gray-600 mb-2" />
          <span className="font-bold text-base text-gray-800">Add Address</span>
        </button>

        {/* Existing Address Cards */}
        {addresses.map((addr, idx) => (
          <div
            key={addr.id}
            className="border border-gray-300 rounded-lg p-5 bg-white shadow-sm flex flex-col justify-between h-64 text-xs"
          >
            <div>
              {addr.isDefault && (
                <div className="flex items-center gap-1 text-[11px] text-gray-500 border-b pb-2 mb-2">
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  <span>Default: </span>
                  <span className="font-bold text-amazon-orange">amazon</span>
                </div>
              )}
              <h4 className="font-bold text-sm text-gray-900 mb-1">{addr.fullName}</h4>
              <p className="text-gray-600">{addr.street}</p>
              <p className="text-gray-600">
                {addr.city}, {addr.state} {addr.pincode}
              </p>
              <p className="text-gray-600">{addr.country}</p>
            </div>

            <div className="border-t pt-3 flex items-center gap-3 text-amazon-link font-semibold">
              <button
                onClick={() => handleDeleteAddress(idx)}
                className="hover:underline text-red-600 flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      {isAddFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
              <MapPin className="h-5 w-5 text-amazon-orange" />
              Add a new delivery address
            </h3>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Street address</label>
                <input
                  type="text"
                  required
                  value={formStreet}
                  onChange={(e) => setFormStreet(e.target.value)}
                  className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">ZIP / Postal Code</label>
                <input
                  type="text"
                  required
                  value={formZip}
                  onChange={(e) => setFormZip(e.target.value)}
                  className="w-full rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="rounded border border-gray-300 px-4 py-1.5 font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-amazon-yellow hover:bg-amazon-yellowHover px-5 py-1.5 font-bold shadow-sm"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
