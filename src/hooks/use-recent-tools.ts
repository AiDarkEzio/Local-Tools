"use client";

import * as React from "react";
import { STORAGE_KEYS, RecentToolItem } from "@/types/storage";

// Custom event to sync same-tab component updates
const RECENT_TOOLS_CHANGE_EVENT = "local-tools:recent-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(RECENT_TOOLS_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(RECENT_TOOLS_CHANGE_EVENT, callback);
  };
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.RECENT_TOOLS) || "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

export function useRecentTools() {
  const recentJson = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const recentTools = React.useMemo<RecentToolItem[]>(() => {
    try {
      return JSON.parse(recentJson);
    } catch {
      return [];
    }
  }, [recentJson]);

  const addRecentTool = React.useCallback((toolId: string) => {
    try {
      const currentRaw = localStorage.getItem(STORAGE_KEYS.RECENT_TOOLS);
      const current: RecentToolItem[] = currentRaw ? JSON.parse(currentRaw) : [];
      const now = Date.now();
      const filtered = current.filter((item) => item.id !== toolId);
      const updated = [{ id: toolId, lastUsedAt: now }, ...filtered].slice(0, 10);

      localStorage.setItem(STORAGE_KEYS.RECENT_TOOLS, JSON.stringify(updated));
      window.dispatchEvent(new Event(RECENT_TOOLS_CHANGE_EVENT));
    } catch (error) {
      console.error("Failed to save recent tools to localStorage:", error);
    }
  }, []);

  const recentIds = React.useMemo(() => recentTools.map((t) => t.id), [recentTools]);

  return {
    recentTools,
    recentIds,
    addRecentTool,
  };
}