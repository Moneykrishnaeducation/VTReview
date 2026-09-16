import React from "react";
import { Link, useNavigate } from "react-router";
import { useAdmin } from "../../context/admin-context";
import { Bell, CheckCircle2, Clock, ShieldAlert, ArrowRight, ShieldCheck } from "lucide-react";

export default function NotificationsCenter() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAdmin();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-mono text-[11px] mb-1">
            <Bell className="h-3.5 w-3.5" />
            <span>ACTIONABLE TASK FEED</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Notification Center & Critical Priority Alerts
          </h1>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-3.5 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-amber-700 dark:text-amber-400 rounded-lg font-bold border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer shadow-xs"
        >
          Mark All As Read
        </button>
      </div>

      {/* Notifications Cards */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-4 shadow-xs ${
              n.read
                ? "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400"
                : "bg-white dark:bg-slate-900 border-amber-500/40 text-slate-800 dark:text-slate-200 ring-1 ring-amber-500/20"
            }`}
          >
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                {!n.read && <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />}
                <span className="font-bold text-slate-900 dark:text-white text-sm">{n.title}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                    n.priority === "high"
                      ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {n.priority} priority
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
              <div className="text-[10px] text-slate-500 font-mono">Timestamp: {n.createdAt}</div>
            </div>

            <div className="flex items-center gap-2">
              {!n.read && (
                <button
                  onClick={() => markNotificationRead(n.id)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  Mark Read
                </button>
              )}

              {n.actionUrl && (
                <button
                  onClick={() => {
                    markNotificationRead(n.id);
                    navigate(n.actionUrl!);
                  }}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Resolve Task</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
