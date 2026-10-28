import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Currency } from "@/lib/utils";

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  mrp: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
  flatDiscount: number;
  appliedCount: number;
}

interface CartState {
  items: CartItem[];
  coupons: AppliedCoupon[];
  currency: Currency;
  setCurrency: (c: Currency) => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discountPercent: number, flatDiscount: number) => { success: boolean; message: string };
  removeCoupon: (code: string) => void;
  mergeGuestCart: (userSavedItems: CartItem[]) => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupons: [],
      currency: "INR",

      setCurrency: (currency) => set({ currency }),

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.productId === product.productId);

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: 1, // Resets to 1
          };
          set({ items: updated });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id || product.productId,
                productId: product.productId,
                title: product.title,
                price: product.price,
                mrp: product.mrp,
                imageUrl: product.imageUrl,
                quantity: quantity,
                stock: product.stock || 50,
              },
            ],
          });
        }
      },

      updateQuantity: async (productId, quantity) => {
        try {
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity }),
          });
          const data = await res.json();
          if (data.success && typeof data.quantity === "number") {
            quantity = data.quantity;
          }
        } catch {
          // Fallback
        }

        const { items } = get();
        const updated = items.map((item) => {
          if (item.productId === productId) {
            return { ...item, quantity };
          }
          return item;
        });

        set({ items: updated });
      },

      removeItem: (productId) => {
        const { items } = get();
        set({ items: items.filter((i) => i.productId !== productId) });
      },

      clearCart: () => set({ items: [], coupons: [] }),

      applyCoupon: (code, discountPercent, flatDiscount) => {
        const { coupons } = get();
        const existingCouponIndex = coupons.findIndex((c) => c.code === code);

        if (existingCouponIndex > -1) {
          const updated = [...coupons];
          updated[existingCouponIndex] = {
            ...updated[existingCouponIndex],
            appliedCount: updated[existingCouponIndex].appliedCount + 1,
          };
          set({ coupons: updated });
          return { success: true, message: `Promo code "${code}" applied.` };
        }

        set({
          coupons: [
            ...coupons,
            {
              code,
              discountPercent,
              flatDiscount,
              appliedCount: 1,
            },
          ],
        });

        return { success: true, message: `Promo code "${code}" applied.` };
      },

      removeCoupon: (code) => {
        const { coupons } = get();
        set({ coupons: coupons.filter((c) => c.code !== code) });
      },

      mergeGuestCart: (userSavedItems) => {
        set({ items: userSavedItems });
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const { coupons } = get();
        const subtotal = get().getSubtotal();
        let totalDiscount = 0;

        for (const c of coupons) {
          const times = c.appliedCount || 1;
          if (c.discountPercent > 0) {
            totalDiscount += subtotal * (c.discountPercent / 100) * times;
          }
          if (c.flatDiscount > 0) {
            totalDiscount += c.flatDiscount * times;
          }
        }

        return Math.min(subtotal, totalDiscount);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "amazon_shopping_cart_storage",
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState || version < 2) {
          return {
            ...persistedState,
            currency: "INR",
          };
        }
        return persistedState;
      },
    }
  )
);
