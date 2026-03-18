export type HealthResponse = {
  status: string;
  service: string;
  model_status: string;
  model_version: string | null;
};

export type ScoreResponse = {
  transaction_id: string;
  prediction: "normal" | "suspicious";
  risk_score: number;
  threshold: number;
  reasons: string[];
  logged_for_review: boolean;
};

export type SuspiciousTransactionItem = {
  id: number;
  transaction_id: string;
  customer_id: string;
  merchant_id: string;
  amount: number;
  currency: string;
  country: string;
  prediction: string;
  risk_score: number;
  threshold: number;
  reasons: string;
  logged_for_review: boolean;
  created_at: string;
};

export type SuspiciousTransactionListResponse = {
  items: SuspiciousTransactionItem[];
};

export type TransactionPayload = {
  transaction_id: string;
  customer_id: string;
  merchant_id: string;
  amount: number;
  currency: string;
  country: string;
  payment_method: "card" | "bank_transfer" | "wallet" | "crypto";
  device_type: "mobile" | "desktop" | "tablet" | "pos";
  timestamp: string;
  is_international: boolean;
  card_present: boolean;
  hour_of_day: number;
  account_age_days: number;
  previous_failed_transactions_24h: number;
};