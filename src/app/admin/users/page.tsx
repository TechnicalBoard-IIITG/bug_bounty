"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, Users, ShoppingCart, MessageSquare, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isDefectActive } from "@/config/defects.config";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const isAccessControlBroken = isDefectActive("HARD_03_ADMIN_ROUTE_UNRESTRICTED_ACCESS");

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/admin/users", {
      headers: {
        "x-user-role": user?.role || "customer",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .catch((err) => console.error("Admin fetch error:", err))
      .finally(() => setIsLoading(false));
  }, [user]);

  // If defect is NOT active, enforce client authorization check
  if (!isAccessControlBroken && user?.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-amazon-text space-y-4">
        <ShieldAlert className="h-16 w-16 text-red-600 mx-auto" />
        <h1 className="text-xl font-bold text-gray-900">403 - Forbidden Access</h1>
        <p className="text-xs text-gray-600">
          You do not have administrative privileges to view this back-office console.
        </p>
        <Link href="/" className="inline-block rounded bg-amazon-yellow px-5 py-2 text-xs font-bold shadow-sm">
          Return to Storefront
        </Link>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-amazon-text space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-300 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-amazon-orange" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Console: User Management</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Back-office participant registry and customer oversight dashboard.
          </p>
        </div>

        {isAccessControlBroken && user?.role !== "admin" && (
          <div className="bg-red-50 border border-red-300 text-red-800 text-xs px-3 py-1.5 rounded flex items-center gap-1.5 font-bold">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>HARD_03 Active: Rendered for role &quot;{user?.role || "anonymous"}&quot; without auth check</span>
          </div>
        )}
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-full">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase">Total Users</span>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-full">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase">Orders Logged</span>
            <div className="text-2xl font-bold text-gray-900">
              {users.reduce((acc, u) => acc + (u.ordersCount || 0), 0)}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-700 rounded-full">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase">Reviews Authored</span>
            <div className="text-2xl font-bold text-gray-900">
              {users.reduce((acc, u) => acc + (u.reviewsCount || 0), 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-md border border-gray-300 px-3 py-2 w-full max-w-sm">
        <Search className="h-4 w-4 text-gray-400 mr-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by name or email..."
          className="w-full text-xs text-gray-800 focus:outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200 uppercase text-[10px]">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Orders</th>
              <th className="px-6 py-3">Reviews</th>
              <th className="px-6 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-700 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  Loading user records...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  No users found matching search criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3.5 flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                      {u.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-900">{u.name}</span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-600 font-mono text-[11px]">{u.email}</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-gray-900">{u.ordersCount ?? 0}</td>
                  <td className="px-6 py-3.5 font-bold text-gray-900">{u.reviewsCount ?? 0}</td>
                  <td className="px-6 py-3.5 text-gray-500 text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
