"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { isDefectActive } from "@/config/defects.config";
import { useCartStore } from "@/store/cartStore";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  createdAt?: string;
  maskedCard?: string;
  cachedAddress?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  accountId: string;
  isLoading: boolean;
  login: (token: string, userData: UserProfile) => void;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  accountId: "default_account",
  isLoading: true,
  login: () => {},
  logout: async () => {},
  updateUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string>("default_account");
  const [isLoading, setIsLoading] = useState(true);
  const mergeGuestCart = useCartStore((s) => s.mergeGuestCart);

  useEffect(() => {
    // Rehydrate from localStorage on client mount
    try {
      const storedToken = localStorage.getItem("amazon_auth_token");
      const storedUser = localStorage.getItem("amazon_user_profile");
      let storedAccountId = localStorage.getItem("amazon_account_id");

      if (storedToken && storedUser) {
        const parsed = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsed);
        storedAccountId = parsed.id;
      }

      if (!storedAccountId) {
        storedAccountId = `team_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36).slice(-4)}`;
      }

      localStorage.setItem("amazon_account_id", storedAccountId);
      document.cookie = `amazon_account_id=${storedAccountId}; path=/; max-age=31536000; SameSite=Lax`;
      setAccountId(storedAccountId);
    } catch (e) {
      console.error("Auth rehydration error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, userData: UserProfile) => {
    setToken(newToken);
    setUser(userData);
    setAccountId(userData.id);
    localStorage.setItem("amazon_auth_token", newToken);
    localStorage.setItem("amazon_user_profile", JSON.stringify(userData));
    localStorage.setItem("amazon_account_id", userData.id);
    document.cookie = `amazon_account_id=${userData.id}; path=/; max-age=31536000; SameSite=Lax`;

    // Seed cached payment and address data for HARD_12 test
    localStorage.setItem(
      "amazon_cached_checkout_data",
      JSON.stringify({
        maskedCard: "**** **** **** 4242",
        cardHolder: userData.name,
        cachedAddress: "123 Amazon Way, Seattle, WA 98109",
      })
    );

    // Fetch user's saved account cart items to simulate guest-to-user merge (HARD_08)
    const simulatedSavedAccountCart = [
      {
        id: "saved-item-1",
        productId: "saved-prod-1",
        title: "Previously Saved Wishlist Item (from Account)",
        price: 29.99,
        mrp: 39.99,
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80",
        quantity: 1,
        stock: 20,
      },
    ];

    mergeGuestCart(simulatedSavedAccountCart);
  };

  const logout = async () => {
    try {
      // Call backend logout route
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (e) {
      console.error("Logout request error:", e);
    }

    setUser(null);
    setToken(null);
    const newGuestAccountId = `team_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36).slice(-4)}`;
    setAccountId(newGuestAccountId);
    localStorage.setItem("amazon_account_id", newGuestAccountId);
    document.cookie = `amazon_account_id=${newGuestAccountId}; path=/; max-age=31536000; SameSite=Lax`;

    // HARD_12: Session Storage Cleanup on Sign-Out
    // When defect is active, logging out fails to clear client-side localStorage,
    // retaining cached user profile data containing masked card and address info
    if (isDefectActive("HARD_12_SESSION_STORAGE_RETAINED_ON_LOGOUT")) {
      localStorage.removeItem("amazon_auth_token");
    } else {
      localStorage.removeItem("amazon_auth_token");
      localStorage.removeItem("amazon_user_profile");
      localStorage.removeItem("amazon_cached_checkout_data");
    }
  };

  const updateUser = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const nextUser = { ...user, ...updatedData };
    setUser(nextUser);
    localStorage.setItem("amazon_user_profile", JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, accountId, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
