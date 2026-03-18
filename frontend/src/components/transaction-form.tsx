"use client";

import { useMemo, useState } from "react";
import { TransactionPayload } from "@/lib/types";

type TransactionFormProps = {
  onSubmit: (payload: TransactionPayload) => Promise<void>;
  isLoading: boolean;
};

function getDefaultPayload(): TransactionPayload {
  const now = new Date();

  return {
    transaction_id: "txn_demo_1001",
    customer_id: "cust_demo_1001",
    merchant_id: "merch_demo_1001",
    amount: 7500,
    currency: "EUR",
    country: "IT",
    payment_method: "card",
    device_type: "mobile",
    timestamp: now.toISOString(),
    is_international: true,
    card_present: false,
    hour_of_day: now.getHours(),
    account_age_days: 20,
    previous_failed_transactions_24h: 3,
  };
}

export function TransactionForm({
  onSubmit,
  isLoading,
}: TransactionFormProps) {
  const [form, setForm] = useState<TransactionPayload>(getDefaultPayload());

  const canSubmit = useMemo(() => {
    return (
      form.transaction_id &&
      form.customer_id &&
      form.merchant_id &&
      form.amount > 0 &&
      form.currency.length === 3 &&
      form.country.length === 2
    );
  }, [form]);

  function updateField<K extends keyof TransactionPayload>(
    key: K,
    value: TransactionPayload[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      ...form,
      currency: form.currency.toUpperCase(),
      country: form.country.toUpperCase(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-zinc-900">Transaction input</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Submit a transaction for real-time fraud risk scoring.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Input
          label="Transaction ID"
          value={form.transaction_id}
          onChange={(value) => updateField("transaction_id", value)}
        />
        <Input
          label="Customer ID"
          value={form.customer_id}
          onChange={(value) => updateField("customer_id", value)}
        />
        <Input
          label="Merchant ID"
          value={form.merchant_id}
          onChange={(value) => updateField("merchant_id", value)}
        />
        <Input
          label="Amount"
          type="number"
          value={form.amount}
          onChange={(value) => updateField("amount", Number(value))}
        />
        <Input
          label="Currency"
          value={form.currency}
          onChange={(value) => updateField("currency", value.toUpperCase())}
        />
        <Input
          label="Country"
          value={form.country}
          onChange={(value) => updateField("country", value.toUpperCase())}
        />

        <Select
          label="Payment method"
          value={form.payment_method}
          onChange={(value) =>
            updateField("payment_method", value as TransactionPayload["payment_method"])
          }
          options={["card", "bank_transfer", "wallet", "crypto"]}
        />
        <Select
          label="Device type"
          value={form.device_type}
          onChange={(value) =>
            updateField("device_type", value as TransactionPayload["device_type"])
          }
          options={["mobile", "desktop", "tablet", "pos"]}
        />

        <Input
          label="Hour of day"
          type="number"
          value={form.hour_of_day}
          onChange={(value) => updateField("hour_of_day", Number(value))}
        />
        <Input
          label="Account age (days)"
          type="number"
          value={form.account_age_days}
          onChange={(value) => updateField("account_age_days", Number(value))}
        />
        <Input
          label="Failed txns (24h)"
          type="number"
          value={form.previous_failed_transactions_24h}
          onChange={(value) =>
            updateField("previous_failed_transactions_24h", Number(value))
          }
        />
        <Input
          label="Timestamp"
          value={form.timestamp}
          onChange={(value) => updateField("timestamp", value)}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Checkbox
          label="International transaction"
          checked={form.is_international}
          onChange={(value) => updateField("is_international", value)}
        />
        <Checkbox
          label="Card present"
          checked={form.card_present}
          onChange={(value) => updateField("card_present", value)}
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit || isLoading}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Scoring..." : "Score transaction"}
      </button>
    </form>
  );
}

type InputProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
};

function Input({ label, value, onChange, type = "text" }: InputProps) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-zinc-800">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
      />
    </label>
  );
}

type SelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-zinc-800">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
      <span className="text-sm text-zinc-700">{label}</span>
    </label>
  );
}