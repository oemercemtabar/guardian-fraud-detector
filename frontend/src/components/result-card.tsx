import { ScoreResponse } from "@/lib/types";
import { ScoreBar } from "@/components/score-bar";
import { StatusBadge } from "@/components/status-badge";

type ResultCardProps = {
  result: ScoreResponse | null;
  isLoading: boolean;
  error: string | null;
};

export function ResultCard({ result, isLoading, error }: ResultCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Model verdict</h2>
        <p className="mt-4 text-sm text-zinc-500">Scoring transaction...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Model verdict</h2>
        <p className="mt-4 text-sm text-rose-600">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Model verdict</h2>
        <p className="mt-4 text-sm text-zinc-500">
          Submit a transaction to see the fraud risk analysis.
        </p>
      </div>
    );
  }

  const tone =
    result.prediction === "suspicious" ? "danger" : "success";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Model verdict</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Transaction ID: {result.transaction_id}
          </p>
        </div>
        <StatusBadge label={result.prediction} tone={tone} />
      </div>

      <div className="mt-6">
        <ScoreBar value={result.risk_score} />
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-zinc-900">Threshold</p>
        <p className="mt-1 text-sm text-zinc-600">{result.threshold}</p>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-zinc-900">Why it was scored this way</p>
        <ul className="mt-2 space-y-2">
          {result.reasons.map((reason) => (
            <li
              key={reason}
              className="rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
            >
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <StatusBadge
          label={result.logged_for_review ? "Logged for review" : "Not logged"}
          tone={result.logged_for_review ? "warning" : "neutral"}
        />
      </div>
    </div>
  );
}