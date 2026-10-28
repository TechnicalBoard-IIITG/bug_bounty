"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [role, setRole] = useState(user?.role || "customer");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
  );
  const [fileMime, setFileMime] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileAcceptType = "*/*";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileMime(file.type || "application/octet-stream");

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payload: Record<string, any> = {
        userId: user?.id || "guest",
        name,
        avatarUrl: avatarPreview,
        mimeType: fileMime,
        role,
      };

      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateUser({
          name: data.user.name,
          role: data.user.role,
          avatarUrl: data.user.avatarUrl,
        });
        setStatusMessage({ text: data.message || "Profile updated successfully!", isError: false });
      } else {
        setStatusMessage({ text: data.error || "Failed to update profile", isError: true });
      }
    } catch {
      setStatusMessage({ text: "An error occurred while saving profile.", isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-amazon-text space-y-6">
      <div className="border-b border-gray-300 pb-4">
        <div className="text-xs text-gray-500 mb-1">
          <Link href="/account" className="text-amazon-link hover:underline">
            Your Account
          </Link>{" "}
          &rsaquo; <span className="text-amazon-orange font-bold">Profile & Avatar</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Your Public Profile</h1>
        <p className="text-xs text-gray-500">
          Personalize your Amazon identity across reviews, lists, and customer discussions.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded text-xs flex items-center gap-2 ${
            statusMessage.isError
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {statusMessage.isError ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form
        onSubmit={handleProfileSubmit}
        className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm space-y-6"
      >
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300 flex items-center justify-center shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-gray-400" />
            )}
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-gray-800 block">Profile Picture</label>
            <input
              type="file"
              accept={fileAcceptType}
              onChange={handleFileChange}
              className="text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-gray-300 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 cursor-pointer"
            />
            {fileMime && (
              <p className="text-[11px] text-gray-500 font-mono">
                Detected MIME: <span className="font-bold">{fileMime}</span>
              </p>
            )}
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-1 text-xs">
          <label className="font-bold text-gray-800 block">Public Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full sm:w-80 rounded border border-gray-400 px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="space-y-1 text-xs">
          <label className="font-bold text-gray-800 block">Email Address</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full sm:w-80 rounded border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Role Select */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <label className="font-bold text-gray-800 text-xs block">Account Role / Privileges</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full sm:w-80 rounded border border-gray-400 bg-white px-3 py-1.5 text-xs focus:border-amazon-orange focus:outline-none"
          >
            <option value="customer">customer (Standard Shopper)</option>
            <option value="admin">admin (Full Elevated Privileges)</option>
            <option value="moderator">moderator (Catalog Moderator)</option>
          </select>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Standard account permissions and role configuration.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4 flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded bg-amazon-yellow hover:bg-amazon-yellowHover px-6 py-2 text-xs font-bold text-amazon-text shadow-sm transition"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/account"
            className="rounded border border-gray-300 hover:bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
