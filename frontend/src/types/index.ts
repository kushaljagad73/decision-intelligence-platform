export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  domain?: string;
  include_sources?: boolean;
}

export interface ChatResponse {
  reply: string;
  conversation_id: string;
  sources?: Array<{ content: string; metadata: Record<string, unknown>; score: number }>;
  confidence?: number;
  suggestions?: string[];
}

export interface DomainSummary {
  domain: string;
  metric_name: string;
  current_value: number;
  previous_value: number;
  change_percent: number;
  trend: "improving" | "declining" | "stable";
  status: "good" | "warning" | "critical";
}

export interface AnalyticsResponse {
  data: Record<string, unknown>[];
  summary: string;
  visualization?: Record<string, unknown>;
  insights: string[];
}
