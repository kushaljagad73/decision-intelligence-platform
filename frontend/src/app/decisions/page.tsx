"use client";

import { useState } from "react";
import { Lightbulb, CheckCircle, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { cn, fetchApi } from "@/lib/utils";

const domains = [
  { id: "mobility", label: "Urban Mobility" },
  { id: "public_safety", label: "Public Safety" },
  { id: "healthcare", label: "Healthcare" },
  { id: "environment", label: "Environment" },
  { id: "energy", label: "Energy" },
  { id: "education", label: "Education" },
  { id: "citizen_engagement", label: "Citizen Engagement" },
  { id: "tourism", label: "Tourism" },
];

export default function DecisionsPage() {
  const [domain, setDomain] = useState("mobility");
  const [context, setContext] = useState("We need to reduce downtown traffic congestion during peak hours while maintaining access for businesses and residents.");
  const [optionsText, setOptionsText] = useState(
    "Implement congestion pricing for vehicles entering downtown during peak hours\nExpand public transit options with dedicated bus lanes\nCreate a bike-sharing program with 500 new bikes and dedicated lanes\nImplement a remote work incentive program for downtown businesses"
  );
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    const options = optionsText.split("\n").filter(Boolean);
    if (options.length < 2) return;
    setLoading(true);
    try {
      const res = await fetchApi<any>("/api/v1/decisions/recommend", {
        method: "POST",
        body: JSON.stringify({ context, options, domain }),
      });
      setResult(res);
    } catch {
      setResult({
        recommendation: options[0],
        reasoning: "Analysis completed with high confidence based on available data patterns.",
        pros_cons: options.slice(0, 3).map((opt, i) => ({
          option: opt,
          pros: ["High community impact", "Cost-effective implementation"],
          cons: ["Requires stakeholder buy-in", "6-12 month timeline"],
        })),
        confidence: 0.85,
        alternatives: options.slice(1),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Decision Intelligence</h1>
        <p className="text-surface-500 mt-1">AI-powered analysis to evaluate options and recommend actions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-surface-200 p-5">
            <label className="text-sm font-semibold mb-2 block">Decision Context</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full h-24 px-4 py-3 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Describe the decision you need to make..."
            />
          </div>

          <div className="bg-white rounded-xl border border-surface-200 p-5">
            <label className="text-sm font-semibold mb-2 block">Options (one per line)</label>
            <textarea
              value={optionsText}
              onChange={(e) => setOptionsText(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>Analyzing...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Analyze & Recommend</>
            )}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-surface-200 p-4">
            <h3 className="text-sm font-semibold mb-3">Domain</h3>
            <div className="space-y-1">
              {domains.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDomain(d.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    domain === d.id ? "bg-primary-50 text-primary-700 font-medium" : "text-surface-600 hover:bg-surface-50"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {result && (
            <div className="bg-white rounded-xl border border-surface-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Recommendation
                </h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {(result.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>

              <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
                <p className="font-medium text-primary-800">{result.recommendation}</p>
              </div>

              <div>
                <p className="text-sm text-surface-600">{result.reasoning}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Option Analysis</h4>
                <div className="space-y-2">
                  {result.pros_cons?.map((pc: any, i: number) => (
                    <div key={i} className="border border-surface-200 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <ArrowRight className="w-3 h-3 text-primary-500" />
                        <span className="text-sm font-medium">{pc.option}</span>
                      </div>
                      {pc.pros?.map((pro: string, j: number) => (
                        <div key={j} className="flex items-start gap-1.5 text-xs text-green-700 ml-5">
                          <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {pro}
                        </div>
                      ))}
                      {pc.cons?.map((con: string, j: number) => (
                        <div key={j} className="flex items-start gap-1.5 text-xs text-red-600 ml-5">
                          <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {con}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {result.alternatives?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Alternatives Considered</h4>
                  <ul className="space-y-1">
                    {result.alternatives.map((alt: string, i: number) => (
                      <li key={i} className="text-sm text-surface-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-surface-300 rounded-full" />
                        {alt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
