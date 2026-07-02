import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ElementType } from "react";

interface DomainCardProps {
  title: string;
  description: string;
  metric: string;
  value: number;
  change: number;
  status: string;
  icon: ElementType;
}

export function DomainCard({ title, description, metric, value, change, status, icon: Icon }: DomainCardProps) {
  const isPositive = change >= 0;
  const statusColor = status === "good" ? "bg-green-100 text-green-700" : status === "warning" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
  const domainSlug = title.toLowerCase().replace(/ /g, "_");

  return (
    <Link href={`/analytics?domain=${domainSlug}`} className="block">
      <div className="bg-white rounded-xl border border-surface-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
            <Icon className="w-5 h-5" />
          </div>
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusColor)}>
            {status}
          </span>
        </div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-surface-500 mt-1 line-clamp-1">{description}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100">
          <span className="text-xs text-surface-500">{metric}</span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold">{value}</span>
            <span className={cn("text-xs font-medium", isPositive ? "text-green-600" : "text-red-600")}>
              {isPositive ? "+" : ""}{change.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
