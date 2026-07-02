"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, TrendingUp, AlertCircle, Lightbulb, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage, ChatResponse } from "@/types";

const domains = [
  { id: "", label: "General", icon: Globe },
  { id: "mobility", label: "Mobility", icon: TrendingUp },
  { id: "public_safety", label: "Safety", icon: AlertCircle },
  { id: "healthcare", label: "Healthcare", icon: AlertCircle },
  { id: "environment", label: "Environment", icon: Globe },
  { id: "energy", label: "Energy", icon: TrendingUp },
  { id: "education", label: "Education", icon: Lightbulb },
  { id: "citizen_engagement", label: "Citizens", icon: UsersIcon },
  { id: "tourism", label: "Tourism", icon: Globe },
];

function UsersIcon() { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>; }

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! I'm your Decision Intelligence assistant. I can help you analyze data, identify trends, predict outcomes, and make better decisions for your community. Select a domain and ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          conversation_id: conversationId,
          domain: domain || undefined,
          include_sources: true,
        }),
      });
      const data: ChatResponse = await res.json();
      setConversationId(data.conversation_id);

      const reply: ChatMessage = {
        role: "assistant",
        content: data.reply,
      };
      setMessages((prev) => [...prev, reply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm currently running in offline mode. Configure Google Cloud credentials for full AI-powered responses." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-6">
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-surface-200">
        <div className="p-4 border-b border-surface-200 flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary-600" />
          <span className="font-semibold">AI Decision Assistant</span>
          {domain && (
            <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full ml-2">
              Domain: {domains.find(d => d.id === domain)?.label}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "")}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
              )}
              <div className={cn(
                "max-w-[75%] rounded-xl px-4 py-3 text-sm",
                msg.role === "user"
                  ? "bg-primary-500 text-white"
                  : "bg-surface-50 text-surface-700"
              )}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 bg-surface-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-surface-600" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-600" />
              </div>
              <div className="bg-surface-50 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-surface-200">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask about community data, trends, or decisions..."
              className="flex-1 px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-64 flex flex-col gap-3">
        <div className="bg-white rounded-xl border border-surface-200 p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            Domain Focus
          </h3>
          <div className="space-y-1">
            {domains.map((d) => {
              const Icon = d.icon;
              return (
                <button
                  key={d.id}
                  onClick={() => setDomain(d.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    domain === d.id
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-surface-600 hover:bg-surface-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {messages.length > 1 && (
          <div className="bg-white rounded-xl border border-surface-200 p-4">
            <h3 className="text-sm font-semibold mb-2">Suggestions</h3>
            <p className="text-xs text-surface-500">Ask follow-up questions to dive deeper</p>
          </div>
        )}
      </div>
    </div>
  );
}
