export function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IT", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatDateTime(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function getRiskTier(score: number): "low" | "medium" | "high" {
  if (score >= 0.65) return "high";
  if (score >= 0.35) return "medium";
  return "low";
}