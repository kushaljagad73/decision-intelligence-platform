"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MessageSquare, BarChart3, Lightbulb, Database, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/decisions", label: "Decisions", icon: Lightbulb },
  { href: "/data-sources", label: "Data Sources", icon: Database },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface-800 text-white flex flex-col">
      <div className="p-5 border-b border-surface-700">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-sm font-bold">
            DI
          </div>
          <div>
            <p className="font-semibold text-sm">DecisionIntel</p>
            <p className="text-xs text-surface-200">AI Platform</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-primary-600 text-white"
                  : "text-surface-200 hover:bg-surface-700 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-surface-700">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-surface-300">
          <Settings className="w-4 h-4" />
          Settings
        </div>
      </div>
    </aside>
  );
}
