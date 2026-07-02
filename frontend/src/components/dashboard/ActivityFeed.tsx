const activities = [
  { time: "2 min ago", text: "Traffic pattern analysis completed for Downtown district", type: "insight" },
  { time: "15 min ago", text: "New citizen feedback data ingested (342 responses)", type: "data" },
  { time: "1 hour ago", text: "Air quality alert: AQI improved to 'Good' across all stations", type: "alert" },
  { time: "2 hours ago", text: "Decision recommendation: Emergency response route optimization", type: "decision" },
  { time: "4 hours ago", text: "Healthcare access report generated for Community Health Initiative", type: "report" },
  { time: "6 hours ago", text: "Energy consumption forecast updated with 92% confidence", type: "forecast" },
  { time: "1 day ago", text: "New data source connected: Smart Water Meter Network", type: "integration" },
  { time: "1 day ago", text: "Citizen satisfaction survey analysis complete (score: 78/100)", type: "insight" },
];

const typeStyles: Record<string, string> = {
  insight: "bg-blue-100 text-blue-700",
  data: "bg-purple-100 text-purple-700",
  alert: "bg-yellow-100 text-yellow-700",
  decision: "bg-green-100 text-green-700",
  report: "bg-orange-100 text-orange-700",
  forecast: "bg-cyan-100 text-cyan-700",
  integration: "bg-indigo-100 text-indigo-700",
};

export function ActivityFeed() {
  return (
    <div className="bg-white rounded-xl border border-surface-200 p-5">
      <div className="space-y-4">
        {activities.map((a, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full mt-1.5 ${typeStyles[a.type]?.split(" ")[0]?.replace("bg-", "bg-") || "bg-surface-300"}`} />
              {i < activities.length - 1 && <div className="w-px flex-1 bg-surface-200 mt-1" />}
            </div>
            <div className="flex-1 pb-3">
              <p className="text-sm text-surface-700">{a.text}</p>
              <p className="text-xs text-surface-400 mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
