import { getRiskTier } from "@/lib/format";

type ScoreBarProps = {
  value: number;
};

export function ScoreBar({ value }: ScoreBarProps) {
  const percentage = Math.max(0, Math.min(100, value * 100));
  const tier = getRiskTier(value);

  const barClass =
    tier === "high"
      ? "bg-rose-500"
      : tier === "medium"
      ? "bg-amber-500"
      : "bg-emerald-500";

  const tierLabel =
    tier === "high" ? "High risk" : tier === "medium" ? "Medium risk" : "Low risk";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-zinc-600">
        <span>Risk score</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">{tierLabel}</span>
          <span className="font-medium text-zinc-900">{value.toFixed(4)}</span>
        </div>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className={`h-full rounded-full transition-all ${barClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}