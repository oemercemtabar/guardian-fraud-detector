"use client";

import { useEffect, useState } from "react";
import { fetchHealth, fetchSuspiciousTransactions, scoreTransaction } from "@/lib/api";
import {
  HealthResponse,
  ScoreResponse,
  SuspiciousTransactionItem,
  TransactionPayload,
} from "@/lib/types";
import { ResultCard } from "@/components/result-card";
import { StatusBadge } from "@/components/status-badge";
import { SuspiciousTable } from "@/components/suspicious-table";
import { TransactionForm } from "@/components/transaction-form";

export default function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [items, setItems] = useState<SuspiciousTransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    setIsBootLoading(true);
    try {
      const [healthData, suspiciousData] = await Promise.all([
        fetchHealth(),
        fetchSuspiciousTransactions(),
      ]);
      setHealth(healthData);
      setItems(suspiciousData.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setIsBootLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function handleScore(payload: TransactionPayload) {
    setIsLoading(true);
    setError(null);

    try {
      const score = await scoreTransaction(payload);
      setResult(score);

      const suspiciousData = await fetchSuspiciousTransactions();
      setItems(suspiciousData.items);

      const healthData = await fetchHealth();
      setHealth(healthData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scoring failed");
    } finally {
      setIsLoading(false);
    }
  }

  const modelTone =
    health?.model_status === "loaded" ? "success" : "warning";

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Guardian
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
              Real-time Fraud Risk Console
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Validate transaction inputs, score fraud risk with a loaded ML model,
              and review suspicious events without slowing down the response path.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge
              label={`API: ${health?.status ?? "loading"}`}
              tone="neutral"
            />
            <StatusBadge
              label={`Model: ${health?.model_status ?? "unknown"}`}
              tone={modelTone}
            />
            <StatusBadge
              label={`Version: ${health?.model_version ?? "n/a"}`}
              tone="neutral"
            />
          </div>
        </header>

        {isBootLoading ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">
            Loading dashboard...
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <TransactionForm onSubmit={handleScore} isLoading={isLoading} />
            <ResultCard result={result} isLoading={isLoading} error={error} />
          </div>
        )}

        <div className="mt-6">
          <SuspiciousTable items={items} />
        </div>
      </div>
    </main>
  );
}