export function formatRwf(amount: number) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const DELIVERY_FEE = 2000;

export const PAYMENT_LABELS: Record<string, string> = {
  MOBILE_MONEY: "Mobile Money (MoMo / Airtel)",
  CARD: "Debit / Credit Card",
  CASH_ON_DELIVERY: "Cash on Delivery",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  PROCESSING: "Processing",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};
