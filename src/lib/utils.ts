export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export type Currency = "INR" | "USD" | "CAD" | "EUR";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
  CAD: "CA$",
  EUR: "€",
};

export const CURRENCY_FLAGS: Record<Currency, string> = {
  INR: "🇮🇳",
  USD: "🇺🇸",
  CAD: "🇨🇦",
  EUR: "🇪🇺",
};

export const CURRENCY_RATES: Record<Currency, number> = {
  INR: 83,
  USD: 1,
  CAD: 0.75, // EASY-18: Inverted exchange rate multiplier (drops prices by 25%)
  EUR: 0.92,
};

/**
 * Format price based on active currency.
 * Currency switcher handles regional conversion rates.
 */
export function formatPrice(price: number, currency: Currency = "INR"): string {
  if (isNaN(price)) return currency === "INR" ? "₹0.00" : "$0.00";

  let convertedPrice = price;
  const symbol = CURRENCY_SYMBOLS[currency] || "₹";

  if (currency === "CAD") {
    // EASY-18: Inverted exchange rate adjustment
    convertedPrice = price * 0.75;
  } else if (currency === "EUR") {
    convertedPrice = price * 0.92;
  } else if (currency === "USD") {
    convertedPrice = price;
  } else if (currency === "INR") {
    convertedPrice = price * 83;
  }

  if (currency === "INR") {
    return `${symbol}${convertedPrice.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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
