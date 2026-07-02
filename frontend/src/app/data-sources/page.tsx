"use client";

import { useState, useEffect } from "react";
import { Database, CheckCircle, XCircle, RefreshCw, Plus, FileText, Upload } from "lucide-react";
import { cn, fetchApi } from "@/lib/utils";

const sourceTypeIcons: Record<string, string> = {
  csv: "CSV",
  json: "JSON",
  pdf: "PDF",
  api: "API",
  webhook: "Webhook",
};

export default function DataSourcesPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIngest, setShowIngest] = useState(false);
  const [ingestForm, setIngestForm] = useState({ source_type: "csv", name: "", domain: "mobility" });

  useEffect(() => {
    fetchApi<{ sources: any[] }>("/api/v1/data/sources")
      .then((data) => setSources(data.sources))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleIngest() {
    try {
      await fetchApi("/api/v1/data/ingest", {
        method: "POST",
        body: JSON.stringify(ingestForm),
      });
      setShowIngest(false);
      setIngestForm({ source_type: "csv", name: "", domain: "mobility" });
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Sources</h1>
          <p className="text-surface-500 mt-1">Manage and connect your data sources for AI analysis</p>
        </div>
        <button
          onClick={() => setShowIngest(!showIngest)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Source
        </button>
      </div>

      {showIngest && (
        <div className="bg-white rounded-xl border border-surface-200 p-5 space-y-4">
          <h3 className="font-semibold">Connect New Data Source</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Source Type</label>
              <select
                value={ingestForm.source_type}
                onChange={(e) => setIngestForm({ ...ingestForm, source_type: e.target.value })}
                className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm"
              >
                <option value="csv">CSV File</option>
                <option value="json">JSON File</option>
                <option value="pdf">PDF Document</option>
                <option value="api">API Endpoint</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Source Name</label>
              <input
                value={ingestForm.name}
                onChange={(e) => setIngestForm({ ...ingestForm, name: e.target.value })}
                placeholder="e.g., Traffic Sensors Q2"
                className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Domain</label>
              <select
                value={ingestForm.domain}
                onChange={(e) => setIngestForm({ ...ingestForm, domain: e.target.value })}
                className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm"
              >
                <option value="mobility">Urban Mobility</option>
                <option value="public_safety">Public Safety</option>
                <option value="healthcare">Healthcare</option>
                <option value="environment">Environment</option>
                <option value="energy">Energy</option>
                <option value="education">Education</option>
                <option value="citizen_engagement">Citizen Engagement</option>
                <option value="tourism">Tourism</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleIngest}
              disabled={!ingestForm.name}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              Ingest Data
            </button>
            <button
              onClick={() => setShowIngest(false)}
              className="px-4 py-2 text-sm text-surface-500 hover:text-surface-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-surface-200">
        <div className="p-4 border-b border-surface-200 flex items-center justify-between">
          <h2 className="font-semibold">Connected Sources</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-surface-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-surface-100">
            {sources.map((source) => (
              <div key={source.id} className="p-4 flex items-center justify-between hover:bg-surface-50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold",
                    source.status === "connected" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  )}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{source.name}</p>
                    <div className="flex items-center gap-3 text-xs text-surface-500 mt-0.5">
                      <span>ID: {source.id}</span>
                      <span>{source.records.toLocaleString()} records</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    source.status === "connected" ? "text-green-600" : "text-yellow-600"
                  )}>
                    {source.status === "connected" ? (
                      <><CheckCircle className="w-3 h-3" /> Connected</>
                    ) : (
                      <><XCircle className="w-3 h-3" /> Disconnected</>
                    )}
                  </span>
                  <span className="text-xs bg-surface-100 text-surface-600 px-2 py-0.5 rounded">
                    {sourceTypeIcons[source.id] || "Data"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
