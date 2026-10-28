"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
  isLoading: boolean;
  login: (token: string, userData: UserProfile) => void;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: async () => {},
  updateUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mergeGuestCart = useCartStore((s) => s.mergeGuestCart);

  useEffect(() => {
    // Rehydrate from localStorage on client mount
    try {
      const storedToken = localStorage.getItem("amazon_auth_token");
      const storedUser = localStorage.getItem("amazon_user_profile");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Auth rehydration error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, userData: UserProfile) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("amazon_auth_token", newToken);
    localStorage.setItem("amazon_user_profile", JSON.stringify(userData));

    // Seed cached payment and address data
    localStorage.setItem(
      "amazon_cached_checkout_data",
      JSON.stringify({
        maskedCard: "**** **** **** 4242",
        cardHolder: userData.name,
        cachedAddress: "123 Amazon Way, Seattle, WA 98109",
      })
    );

    // Fetch user's saved account cart items
    const simulatedSavedAccountCart = [
      {
        id: "saved-item-1",
        productId: "prod-e01",
        title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
        price: 348.0,
        mrp: 399.99,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        quantity: 1,
        stock: 45,
      },
    ];

    mergeGuestCart(simulatedSavedAccountCart);
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("amazon_auth_token");
      localStorage.removeItem("amazon_user_profile");

      // Retains amazon_cached_checkout_data in localStorage (HARD-12 behavior)
    }
  };

  const updateUser = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    try {
      localStorage.setItem("amazon_user_profile", JSON.stringify(updated));
    } catch (e) {
      console.error("Profile cache update error:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
