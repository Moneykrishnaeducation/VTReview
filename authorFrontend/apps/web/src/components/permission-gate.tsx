import React from "react";
import { useAdmin } from "../context/admin-context";
import { Lock, AlertCircle } from "lucide-react";

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLockedBadge?: boolean;
}

export function PermissionGate({
  permission,
  children,
  fallback,
  showLockedBadge = false,
}: PermissionGateProps) {
  const { hasPermission, activeRoleDef } = useAdmin();
  const permitted = hasPermission(permission);

  if (permitted) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showLockedBadge) {
    return (
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            Action restricted for role <strong className="text-slate-200">{activeRoleDef.name}</strong> (Requires permission <code className="text-amber-400 font-mono">{permission}</code>).
          </span>
        </div>
      </div>
    );
  }

  return null;
}
