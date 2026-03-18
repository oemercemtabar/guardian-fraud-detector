"use client";

import { useEffect, useMemo, useState } from "react";
import { ResultCard } from "@/components/result-card";
import { StatusBadge } from "@/components/status-badge";
import { SuspiciousTable } from "@/components/suspicious-table";
import { TransactionForm } from "@/components/transaction-form";
import { formatCurrency } from "@/lib/format";
import {
  fetchHealth,
  fetchSuspiciousTransactions,
  scoreTransaction,
} from "@/lib/api";
import {
  HealthResponse,
  ScoreResponse,
  SuspiciousTransactionItem,
  TransactionPayload,
} from "@/lib/types";

export default function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [items, setItems] = useState<SuspiciousTransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    const [healthData, suspiciousData] = await Promise.all([
      fetchHealth(),
      fetchSuspiciousTransactions(),
    ]);
    setHealth(healthData);
    setItems(suspiciousData.items);
  }

  async function boot() {
    setIsBootLoading(true);
    setError(null);

    try {
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setIsBootLoading(false);
    }
  }

  useEffect(() => {
    void boot();
  }, []);

  async function handleRefresh() {
    setIsRefreshing(true);
    setError(null);

    try {
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refresh failed");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleScore(payload: TransactionPayload) {
    setIsLoading(true);
    setError(null);

    try {
      const score = await scoreTransaction(payload);
      setResult(score);
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scoring failed");
    } finally {
      setIsLoading(false);
    }
  }

  const modelTone =
    health?.model_status === "loaded"
      ? "success"
      : health?.model_status === "unknown"
      ? "warning"
      : "info";

  const apiTone = health?.status === "ok" ? "success" : "warning";

  const metrics = useMemo(() => {
    const totalFlagged = items.length;
    const avgRisk =
      totalFlagged > 0
        ? items.reduce((sum, item) => sum + item.risk_score, 0) / totalFlagged
        : 0;
    const highestAmount =
      totalFlagged > 0 ? Math.max(...items.map((item) => item.amount)) : 0;
    const latest = totalFlagged > 0 ? items[0] : null;

    return {
      totalFlagged,
      avgRisk,
      highestAmount,
      latestTransactionId: latest?.transaction_id ?? "n/a",
    };
  }, [items]);

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <header className="mb-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Guardian
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                Real-time Fraud Risk Console
              </h1>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Validate transaction inputs, score fraud risk with a loaded ML
                model, and review suspicious events without slowing down the
                response path.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  label={`API: ${health?.status ?? "loading"}`}
                  tone={apiTone}
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

              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRefreshing ? "Refreshing..." : "Refresh data"}
              </button>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total flagged" value={String(metrics.totalFlagged)} />
          <MetricCard label="Average risk" value={metrics.avgRisk.toFixed(4)} />
          <MetricCard
            label="Highest amount"
            value={formatCurrency(metrics.highestAmount, "EUR")}
          />
          <MetricCard
            label="Latest transaction"
            value={metrics.latestTransactionId}
          />
        </section>

        {isBootLoading ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm">
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <TransactionForm onSubmit={handleScore} isLoading={isLoading} />
              <ResultCard result={result} isLoading={isLoading} error={error} />
            </div>

            <div className="mt-6">
              <SuspiciousTable items={items} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
    </div>
  );
}