"use client";

import { useState, useEffect } from "react";
import { DomainCard } from "@/components/dashboard/DomainCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { fetchApi, type DomainSummary } from "@/lib/utils";
import {
  Train, Shield, Heart, Leaf, Zap, GraduationCap, Users, Compass,
} from "lucide-react";

const domainIcons: Record<string, React.ElementType> = {
  mobility: Train,
  public_safety: Shield,
  healthcare: Heart,
  environment: Leaf,
  energy: Zap,
  education: GraduationCap,
  citizen_engagement: Users,
  tourism: Compass,
};

const domainLabels: Record<string, string> = {
  mobility: "Urban Mobility",
  public_safety: "Public Safety",
  healthcare: "Healthcare",
  environment: "Environment",
  energy: "Energy",
  education: "Education",
  citizen_engagement: "Citizen Engagement",
  tourism: "Tourism",
};

const domainDescriptions: Record<string, string> = {
  mobility: "Traffic flow, transit, and road infrastructure analytics",
  public_safety: "Crime, emergency response, and disaster preparedness",
  healthcare: "Community health, clinics, and wellness programs",
  environment: "Air quality, waste, and sustainability metrics",
  energy: "Smart grid, consumption, and efficiency data",
  education: "Schools, performance, and learning programs",
  citizen_engagement: "Feedback, services, and participation analytics",
  tourism: "Visitors, spending, and economic development",
};

export default function DashboardPage() {
  const [summaries, setSummaries] = useState<DomainSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<DomainSummary[]>("/api/v1/analytics/summary")
      .then(setSummaries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Decision Intelligence Dashboard</h1>
        <p className="text-surface-500 mt-1">
          AI-powered insights for smarter community decisions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Active Data Sources" value="8" change="+2" icon={DatabaseIcon} />
        <MetricCard label="AI Insights Generated" value="1,247" change="+18%" icon={InsightsIcon} />
        <MetricCard label="Decisions Supported" value="432" change="+12%" icon={DecisionIcon} />
        <MetricCard label="Community Score" value="84" change="+5.2" icon={ScoreIcon} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Domain Intelligence</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-xl border border-surface-200 animate-pulse" />
              ))
            ) : (
              summaries.map((s) => (
                <DomainCard
                  key={s.domain}
                  title={domainLabels[s.domain] || s.domain}
                  description={domainDescriptions[s.domain] || ""}
                  metric={s.metric_name}
                  value={s.current_value}
                  change={s.change_percent}
                  status={s.status}
                  icon={domainIcons[s.domain] || Leaf}
                />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon() { return <DatabaseIconSvg />; }
function DatabaseIconSvg() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>; }
function InsightsIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>; }
function DecisionIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function ScoreIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>; }
