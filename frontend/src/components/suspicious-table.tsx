"use client";

import { useMemo, useState } from "react";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { SuspiciousTransactionItem } from "@/lib/types";

type SuspiciousTableProps = {
  items: SuspiciousTransactionItem[];
};

type SortKey = "created_at" | "risk_score" | "amount";

export function SuspiciousTable({ items }: SuspiciousTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    const base = !q
      ? items
      : items.filter((item) => {
          return (
            item.transaction_id.toLowerCase().includes(q) ||
            item.customer_id.toLowerCase().includes(q) ||
            item.merchant_id.toLowerCase().includes(q) ||
            item.country.toLowerCase().includes(q)
          );
        });

    return [...base].sort((a, b) => {
      if (sortKey === "created_at") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortKey === "risk_score") {
        return b.risk_score - a.risk_score;
      }
      return b.amount - a.amount;
    });
  }, [items, query, sortKey]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Recent suspicious activity
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Review flagged transactions logged asynchronously by the API.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search transaction, customer, merchant, country"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full min-w-[360px] rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-900"
          />

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-900"
          >
            <option value="created_at">Sort: newest</option>
            <option value="risk_score">Sort: highest risk</option>
            <option value="amount">Sort: highest amount</option>
          </select>

          <span className="whitespace-nowrap text-sm text-zinc-500">
            {filteredItems.length} records
          </span>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500">
          No suspicious transactions match your current search.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-3 py-2">Transaction</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Country</th>
                <th className="px-3 py-2">Risk</th>
                <th className="px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="bg-zinc-50 text-sm text-zinc-700 transition hover:bg-zinc-100"
                >
                  <td className="rounded-l-xl px-3 py-3 font-medium text-zinc-900">
                    {item.transaction_id}
                  </td>
                  <td className="px-3 py-3">
                    {formatCurrency(item.amount, item.currency)}
                  </td>
                  <td className="px-3 py-3">{item.country}</td>
                  <td className="px-3 py-3">{item.risk_score.toFixed(4)}</td>
                  <td className="rounded-r-xl px-3 py-3">
                    {formatDateTime(item.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}