export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export type Currency = "USD" | "CAD" | "EUR";

/**
 * Format price based on active currency.
 * Currency switcher handles regional conversion rates.
 */
export function formatPrice(price: number, currency: Currency = "USD"): string {
  if (isNaN(price)) return "$0.00";

  let convertedPrice = price;
  let symbol = "$";

  if (currency === "CAD") {
    symbol = "CA$";
    // CAD exchange rate adjustment
    convertedPrice = price * 0.75;
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
