import { isDefectActive } from "@/config/defects.config";

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export type Currency = "USD" | "CAD" | "EUR";

/**
 * Format price based on active currency.
 * EASY_18: When switched to CAD, drops displayed prices by 25% (price * 0.75) instead of standard multiplier (~1.35).
 */
export function formatPrice(price: number, currency: Currency = "USD"): string {
  if (isNaN(price)) return "$0.00";

  let convertedPrice = price;
  let symbol = "$";

  if (currency === "CAD") {
    symbol = "CA$";
    if (isDefectActive("EASY_18_CURRENCY_CONVERSION_LOSS")) {
      // Inverted exchange rate drops price by 25%
      convertedPrice = price * 0.75;
    } else {
      convertedPrice = price * 1.36;
    }
  } else if (currency === "EUR") {
    symbol = "€";
    convertedPrice = price * 0.92;
  }

  return `${symbol}${convertedPrice.toFixed(2)}`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function calculateDiscountPercent(mrp: number, price: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
