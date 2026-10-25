import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isDefectActive } from "@/config/defects.config";

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
  currency: "USD" | "CAD" | "EUR";
  setCurrency: (c: "USD" | "CAD" | "EUR") => void;
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
      currency: "USD",

      setCurrency: (currency) => set({ currency }),

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.productId === product.productId);

        if (existingIndex > -1) {
          // MED_18: Overwrite quantity to 1 instead of incrementing existing count
          if (isDefectActive("MED_18_CART_QTY_OVERWRITE_ON_ADD")) {
            const updated = [...items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: 1, // Bug: resets to 1
            };
            set({ items: updated });
          } else {
            const updated = [...items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            set({ items: updated });
          }
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
        // HARD_11: Check backend mutation endpoint at /api/cart
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
          // Fallback to local logic if offline or backend unreachable
        }

        const { items } = get();
        const updated = items.map((item) => {
          if (item.productId === productId) {
            // HARD_11: When active, allows negative integers to drop subtotal
            if (isDefectActive("HARD_11_CART_QUANTITY_BOUNDARY_NEGATIVE")) {
              return { ...item, quantity };
            }
            return { ...item, quantity: Math.max(1, quantity) };
          }
          return item;
        });

        // HARD_09: Storage synchronization conflict
        // If defect is active, updating quantities in Tab B writes without checking stale state from Tab A
        set({ items: updated });
      },

      removeItem: (productId) => {
        const { items } = get();
        set({ items: items.filter((i) => i.productId !== productId) });
      },

      clearCart: () => set({ items: [], coupons: [] }),

      applyCoupon: (code, discountPercent, flatDiscount) => {
        const { coupons } = get();

        // HARD_14: Case-Sensitive Promo Stacking
        // If defect active, "WELCOME10" and "welcome10" are treated as distinct codes
        const codeToMatch = isDefectActive("HARD_14_CASE_SENSITIVE_PROMO_STACKING")
          ? code
          : code.toUpperCase();

        const existingCouponIndex = coupons.findIndex((c) =>
          isDefectActive("HARD_14_CASE_SENSITIVE_PROMO_STACKING")
            ? c.code === codeToMatch
            : c.code.toUpperCase() === codeToMatch
        );

        if (existingCouponIndex > -1) {
          // MED_07: Iterative Coupon Application
          // If defect active, submitting the same valid promo code repeatedly compounds discount
          if (isDefectActive("MED_07_ITERATIVE_COUPON_COMPOUNDING")) {
            const updated = [...coupons];
            updated[existingCouponIndex] = {
              ...updated[existingCouponIndex],
              appliedCount: updated[existingCouponIndex].appliedCount + 1,
            };
            set({ coupons: updated });
            return { success: true, message: `Promo code "${code}" re-applied! Compounding discount.` };
          }

          return { success: false, message: `Promo code "${code}" is already applied.` };
        }

        set({
          coupons: [
            ...coupons,
            {
              code: codeToMatch,
              discountPercent,
              flatDiscount,
              appliedCount: 1,
            },
          ],
        });

        return { success: true, message: `Promo code "${code}" successfully applied!` };
      },

      removeCoupon: (code) => {
        const { coupons } = get();
        set({ coupons: coupons.filter((c) => c.code !== code) });
      },

      mergeGuestCart: (userSavedItems) => {
        // HARD_08: Guest-to-User Cart Merging
        // Signing in with an active guest cart overwrites and wipes the user's saved account cart items
        if (isDefectActive("HARD_08_GUEST_CART_WIPES_USER_CART")) {
          // Keep only current guest cart, completely drop userSavedItems
          return;
        }

        // Proper behavior: merge items
        const { items } = get();
        const merged = [...items];
        for (const userItem of userSavedItems) {
          const idx = merged.findIndex((i) => i.productId === userItem.productId);
          if (idx > -1) {
            merged[idx].quantity += userItem.quantity;
          } else {
            merged.push(userItem);
          }
        }
        set({ items: merged });
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((acc, item) => {
          // MED_08: Line Item Quantity Multiplication defect in cart table
          // Note: getSubtotal calculates running arithmetic
          return acc + item.price * item.quantity;
        }, 0);
      },

      getDiscountAmount: () => {
        const { items, coupons } = get();
        let runningSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        let totalDiscount = 0;

        for (const coupon of coupons) {
          if (coupon.discountPercent > 0) {
            const count = coupon.appliedCount || 1;
            for (let i = 0; i < count; i++) {
              const disc = (runningSubtotal * coupon.discountPercent) / 100;
              totalDiscount += disc;
              // If MED_07 iterative compounding, subsequent passes discount the remaining subtotal
              if (isDefectActive("MED_07_ITERATIVE_COUPON_COMPOUNDING")) {
                runningSubtotal = Math.max(0, runningSubtotal - disc);
              }
            }
          }
          if (coupon.flatDiscount > 0) {
            totalDiscount += coupon.flatDiscount;
            runningSubtotal = Math.max(0, runningSubtotal - coupon.flatDiscount);
          }
        }

        return Number(totalDiscount.toFixed(2));
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "amazon_replica_cart_v1",
      skipHydration: true,
    }
  )
);
