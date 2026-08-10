"use client";

import * as React from "react";
import { STORAGE_KEYS } from "@/types/storage";
import { toast } from "sonner";

// Custom event to sync same-tab component updates
const FAVORITES_CHANGE_EVENT = "local-tools:favorites-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(FAVORITES_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(FAVORITES_CHANGE_EVENT, callback);
  };
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.FAVORITES) || "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

export function useFavorites() {
  const favoritesJson = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const favorites = React.useMemo<string[]>(() => {
    try {
      return JSON.parse(favoritesJson);
    } catch {
      return [];
    }
  }, [favoritesJson]);

  const toggleFavorite = React.useCallback((toolId: string, toolName?: string) => {
    try {
      const currentRaw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      const current: string[] = currentRaw ? JSON.parse(currentRaw) : [];
      const isFav = current.includes(toolId);
      const updated = isFav ? current.filter((id) => id !== toolId) : [...current, toolId];

      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT));

      if (isFav) {
        toast.info(`Removed ${toolName || "tool"} from favorites`);
      } else {
        toast.success(`Added ${toolName || "tool"} to favorites!`);
      }
    } catch (error) {
      console.error("Failed to save favorites to localStorage:", error);
    }
  }, []);

  const isFavorite = React.useCallback(
    (toolId: string) => favorites.includes(toolId),
    [favorites]
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}