"use client";

import { useMemo, useState } from "react";
import {
  formatDateTimeLocalInput,
  toIsoFromLocalDateTime,
} from "@/lib/format";
import { TransactionPayload } from "@/lib/types";

type TransactionFormProps = {
  onSubmit: (payload: TransactionPayload) => Promise<void>;
  isLoading: boolean;
};

type FormErrors = Partial<Record<keyof TransactionPayload, string>>;

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

function validateForm(form: TransactionPayload): FormErrors {
  const errors: FormErrors = {};

  if (!form.transaction_id.trim()) errors.transaction_id = "Transaction ID is required.";
  if (!form.customer_id.trim()) errors.customer_id = "Customer ID is required.";
  if (!form.merchant_id.trim()) errors.merchant_id = "Merchant ID is required.";

  if (!(form.amount > 0)) errors.amount = "Amount must be greater than 0.";
  if (!/^[A-Z]{3}$/.test(form.currency)) errors.currency = "Use a 3-letter currency code.";
  if (!/^[A-Z]{2}$/.test(form.country)) errors.country = "Use a 2-letter country code.";

  if (form.hour_of_day < 0 || form.hour_of_day > 23) {
    errors.hour_of_day = "Hour must be between 0 and 23.";
  }

  if (form.account_age_days < 0) {
    errors.account_age_days = "Account age cannot be negative.";
  }

  if (form.previous_failed_transactions_24h < 0) {
    errors.previous_failed_transactions_24h = "Failed transactions cannot be negative.";
  }

  if (!form.timestamp) {
    errors.timestamp = "Timestamp is required.";
  }

  return errors;
}

export function TransactionForm({
  onSubmit,
  isLoading,
}: TransactionFormProps) {
  const [form, setForm] = useState<TransactionPayload>(getDefaultPayload());
  const [timestampLocal, setTimestampLocal] = useState(
    formatDateTimeLocalInput(new Date())
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const canSubmit = useMemo(() => {
    return Object.keys(validateForm(form)).length === 0;
  }, [form]);

  function updateField<K extends keyof TransactionPayload>(
    key: K,
    value: TransactionPayload[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const normalizedPayload: TransactionPayload = {
      ...form,
      currency: form.currency.toUpperCase(),
      country: form.country.toUpperCase(),
      timestamp: toIsoFromLocalDateTime(timestampLocal),
    };

    const nextErrors = validateForm(normalizedPayload);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    await onSubmit(normalizedPayload);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-zinc-900">Transaction input</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Submit a transaction for real-time fraud risk scoring. Use the default demo
        values or edit fields to test different scenarios.
      </p>

      <Section
        title="Identity"
        description="Core transaction and participant identifiers."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Transaction ID"
            value={form.transaction_id}
            onChange={(value) => updateField("transaction_id", value)}
            error={errors.transaction_id}
          />
          <Input
            label="Customer ID"
            value={form.customer_id}
            onChange={(value) => updateField("customer_id", value)}
            error={errors.customer_id}
          />
          <Input
            label="Merchant ID"
            value={form.merchant_id}
            onChange={(value) => updateField("merchant_id", value)}
            error={errors.merchant_id}
          />
        </div>
      </Section>

      <Section
        title="Payment context"
        description="Monetary, geographic, and channel-level signals."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Amount"
            type="number"
            value={form.amount}
            onChange={(value) => updateField("amount", Number(value))}
            error={errors.amount}
          />
          <Input
            label="Currency"
            value={form.currency}
            onChange={(value) => updateField("currency", value.toUpperCase())}
            error={errors.currency}
          />
          <Input
            label="Country"
            value={form.country}
            onChange={(value) => updateField("country", value.toUpperCase())}
            error={errors.country}
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
        </div>
      </Section>

      <Section
        title="Behavioral signals"
        description="Time and account context used by the scoring model."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Hour of day"
            type="number"
            value={form.hour_of_day}
            onChange={(value) => updateField("hour_of_day", Number(value))}
            error={errors.hour_of_day}
          />
          <Input
            label="Account age (days)"
            type="number"
            value={form.account_age_days}
            onChange={(value) => updateField("account_age_days", Number(value))}
            error={errors.account_age_days}
          />
          <Input
            label="Failed txns (24h)"
            type="number"
            value={form.previous_failed_transactions_24h}
            onChange={(value) =>
              updateField("previous_failed_transactions_24h", Number(value))
            }
            error={errors.previous_failed_transactions_24h}
          />
          <Input
            label="Timestamp"
            type="datetime-local"
            value={timestampLocal}
            onChange={(value) => setTimestampLocal(value)}
            error={errors.timestamp}
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
      </Section>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit || isLoading}
          className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Scoring..." : "Score transaction"}
        </button>

        <span className="text-sm text-zinc-500">
          Inputs are validated before submission.
        </span>
      </div>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

type InputProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
};

function Input({
  label,
  value,
  onChange,
  type = "text",
  error,
}: InputProps) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-zinc-800">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
          error
            ? "border-rose-300 focus:border-rose-500"
            : "border-zinc-300 focus:border-zinc-900"
        }`}
      />
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
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
    <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
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