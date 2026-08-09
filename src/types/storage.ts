// src/types/storage.ts

export interface RecentToolItem {
  id: string;
  lastUsedAt: number; // Unix timestamp in milliseconds
}

export interface UserPreferencesStorage {
  favorites: string[];         // Array of Tool IDs e.g. ['json-formatter', 'image-cropper']
  recentTools: RecentToolItem[];// Sorted descending by lastUsedAt
}

export const STORAGE_KEYS = {
  FAVORITES: 'local-tools:favorites',
  RECENT_TOOLS: 'local-tools:recent',
} as const;