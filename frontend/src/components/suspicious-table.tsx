import { SuspiciousTransactionItem } from "@/lib/types";

type SuspiciousTableProps = {
  items: SuspiciousTransactionItem[];
};

export function SuspiciousTable({ items }: SuspiciousTableProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">
          Recent suspicious activity
        </h2>
        <span className="text-sm text-zinc-500">{items.length} records</span>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">
          No suspicious transactions logged yet.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
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
              {items.map((item) => (
                <tr key={item.id} className="rounded-xl bg-zinc-50 text-sm text-zinc-700">
                  <td className="px-3 py-3 font-medium text-zinc-900">
                    {item.transaction_id}
                  </td>
                  <td className="px-3 py-3">
                    {item.amount} {item.currency}
                  </td>
                  <td className="px-3 py-3">{item.country}</td>
                  <td className="px-3 py-3">{item.risk_score.toFixed(4)}</td>
                  <td className="px-3 py-3">
                    {new Date(item.created_at).toLocaleString()}
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