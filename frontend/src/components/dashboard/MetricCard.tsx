import type { ElementType } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  icon: ElementType;
}

export function MetricCard({ label, value, change, icon: Icon }: MetricCardProps) {
  const isPositive = change.startsWith("+");
  return (
    <div className="bg-white rounded-xl border border-surface-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-surface-500">{label}</span>
        <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
          <Icon />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {change}
        </span>
      </div>
    </div>
  );
}
