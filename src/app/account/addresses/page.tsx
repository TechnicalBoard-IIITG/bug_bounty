"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, MapPin, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isDefectActive } from "@/config/defects.config";

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

  // MED_14: Address Management List Indexing
  // Clicking "Delete" on the second entry in saved addresses list deletes the first address record instead
  const handleDeleteAddress = async (index: number) => {
    if (addresses.length === 0) return;

    let targetId = addresses[index]?.id;

    if (isDefectActive("MED_14_ADDRESS_DELETE_INDEXING_OFFSET") && index === 1) {
      // Off-by-one list indexing defect: Targets the first address record!
      targetId = addresses[0]?.id;
    }

    if (!targetId) return;

    const confirmDelete = confirm(`Are you sure you want to remove this address?`);
    if (!confirmDelete) return;

    try {
      await fetch(`/api/addresses/${targetId}`, { method: "DELETE" });
      // Update UI state reflecting whichever ID was targeted
      setAddresses((prev) => prev.filter((a) => a.id !== targetId));
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
      <div className="border-b border-gray-300 pb-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 mb-1">
            <Link href="/account" className="text-amazon-link hover:underline">
              Your Account
            </Link>{" "}
            &rsaquo; <span className="text-amazon-orange font-bold">Your Addresses</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Your Addresses</h1>
        </div>

        <button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className="rounded-md bg-amazon-yellow hover:bg-amazon-yellowHover px-4 py-2 text-xs font-bold text-amazon-text shadow-sm flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> Add Address
        </button>
      </div>

      {/* Add Address Form Modal / Accordion */}
      {isAddFormOpen && (
        <form
          onSubmit={handleAddAddress}
          className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm space-y-4 max-w-xl"
        >
          <h3 className="text-sm font-bold text-gray-900">Add a new address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full rounded border border-gray-400 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Street Address</label>
              <input
                type="text"
                required
                value={formStreet}
                onChange={(e) => setFormStreet(e.target.value)}
                className="w-full rounded border border-gray-400 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">City</label>
              <input
                type="text"
                required
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                className="w-full rounded border border-gray-400 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">State</label>
              <input
                type="text"
                required
                value={formState}
                onChange={(e) => setFormState(e.target.value)}
                className="w-full rounded border border-gray-400 px-3 py-1.5"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">ZIP Code</label>
              <input
                type="text"
                required
                value={formZip}
                onChange={(e) => setFormZip(e.target.value)}
                className="w-full rounded border border-gray-400 px-3 py-1.5"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="rounded bg-amazon-yellow px-4 py-1.5 text-xs font-bold shadow-sm"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setIsAddFormOpen(false)}
              className="rounded border border-gray-300 px-4 py-1.5 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Address Cards Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-gray-500">Loading saved addresses...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {addresses.map((addr, index) => (
            <div
              key={addr.id}
              className={`rounded-lg border p-5 shadow-sm bg-white flex flex-col justify-between text-xs space-y-3 ${
                addr.isDefault ? "border-amazon-orange ring-1 ring-amazon-orange" : "border-gray-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">
                    Address #{index + 1}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold text-amazon-orange bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Default
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-gray-700">
                  <h4 className="font-bold text-sm text-gray-900">{addr.fullName}</h4>
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} {addr.pincode}
                  </p>
                  <p>{addr.country}</p>
                </div>
              </div>

              {/* Card Actions with MED_14 defect */}
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs">
                <span className="text-gray-400 text-[11px]">ID: {addr.id}</span>
                <button
                  onClick={() => handleDeleteAddress(index)}
                  className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
