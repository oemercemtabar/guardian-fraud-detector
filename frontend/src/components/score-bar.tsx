type ScoreBarProps = {
  value: number;
};

export function ScoreBar({ value }: ScoreBarProps) {
  const percentage = Math.max(0, Math.min(100, value * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-zinc-600">
        <span>Risk score</span>
        <span className="font-medium text-zinc-900">{value.toFixed(4)}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-zinc-900 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}