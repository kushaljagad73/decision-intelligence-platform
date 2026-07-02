"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, fetchApi } from "@/lib/utils";
import type { DomainSummary, AnalyticsResponse } from "@/types";
import { SimpleChart } from "@/components/charts/SimpleChart";

const domainLabels: Record<string, string> = {
  mobility: "Urban Mobility & Transportation",
  public_safety: "Public Safety & Emergency",
  healthcare: "Healthcare & Community Wellness",
  environment: "Environmental Sustainability",
  energy: "Energy & Smart Utilities",
  education: "Education & Learning",
  citizen_engagement: "Citizen Engagement",
  tourism: "Tourism & Economic Development",
};

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const domainParam = searchParams.get("domain") || "";
  const [summaries, setSummaries] = useState<DomainSummary[]>([]);
  const [selectedDomain, setSelectedDomain] = useState(domainParam);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<DomainSummary[]>("/api/v1/analytics/summary")
      .then(setSummaries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedDomain) return;
    fetchApi<AnalyticsResponse>("/api/v1/analytics/query", {
      method: "POST",
      body: JSON.stringify({ query: `Analyze ${selectedDomain} trends`, domain: selectedDomain }),
    }).then(setAnalytics).catch(() => {});
  }, [selectedDomain]);

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "improving") return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === "declining") return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-yellow-600" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics & Insights</h1>
        <p className="text-surface-500 mt-1">Explore data trends across community domains</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedDomain("")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            !selectedDomain ? "bg-primary-500 text-white" : "bg-white border border-surface-200 text-surface-600 hover:bg-surface-50"
          )}
        >
          All Domains
        </button>
        {Object.entries(domainLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedDomain(key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              selectedDomain === key ? "bg-primary-500 text-white" : "bg-white border border-surface-200 text-surface-600 hover:bg-surface-50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Domain Performance</h2>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-xl border border-surface-200 animate-pulse" />
            ))
          ) : (
            summaries.map((s) => (
              <div
                key={s.domain}
                className="bg-white rounded-xl border border-surface-200 p-4 flex items-center justify-between hover:border-primary-300 cursor-pointer transition-colors"
                onClick={() => setSelectedDomain(s.domain)}
              >
                <div>
                  <p className="font-medium text-sm">{domainLabels[s.domain] || s.domain}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{s.metric_name}: {s.current_value}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    s.status === "good" ? "bg-green-100 text-green-700" : s.status === "warning" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                  )}>
                    {s.status}
                  </span>
                  <TrendIcon trend={s.trend} />
                  <span className={cn(
                    "text-sm font-medium",
                    s.change_percent >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {s.change_percent >= 0 ? "+" : ""}{s.change_percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {selectedDomain ? domainLabels[selectedDomain] || "Selected Domain" : "Select a Domain"} Insights
          </h2>
          {selectedDomain && analytics ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-surface-200 p-5">
                <p className="text-sm text-surface-700">{analytics.summary}</p>
              </div>
              <div className="bg-white rounded-xl border border-surface-200 p-5">
                <h3 className="text-sm font-semibold mb-3">Key Insights</h3>
                <ul className="space-y-2">
                  {analytics.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                      <BarChart3 className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              <SimpleChart />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-surface-200 p-8 text-center text-surface-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-3" />
              <p>Select a domain above to view detailed analytics and insights</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-white rounded-xl border border-surface-200" />}>
      <AnalyticsContent />
    </Suspense>
  );
}
