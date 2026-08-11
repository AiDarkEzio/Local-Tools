// src/config/categories.ts

export type ToolCategory =
  | 'dev'
  | 'text'
  | 'image'
  | 'video-audio'
  | 'document'
  | 'security'
  | 'math-finance'
  | 'time'
  | 'generators'
  | 'unit-converter'
  | 'games-edu';

export type CategoryFilterKey = 'all' | 'favorites' | 'recent' | ToolCategory;

export interface CategoryConfig {
  id: CategoryFilterKey;
  label: string;
  dotColor: string;       // Tailwind class for small indicator dots
  pillBorder: string;     // Pastel border color for landing page filter pills
  pillActiveBg: string;   // Active background state when pill is selected
  badgeBg: string;        // Soft pastel background for Tool Card category badges
  badgeText: string;      // Contrasting text color for Tool Card category badges
  badgeBorder: string;    // Soft border for Tool Card category badges
}

export const CATEGORIES_MAP: Record<CategoryFilterKey, CategoryConfig> = {
  all: {
    id: 'all',
    label: 'All Tools',
    dotColor: 'bg-emerald-500',
    pillBorder: 'border-emerald-500/30 hover:border-emerald-500/60',
    pillActiveBg: 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    badgeBorder: 'border-emerald-500/20',
  },
  favorites: {
    id: 'favorites',
    label: 'Favorites',
    dotColor: 'bg-amber-400',
    pillBorder: 'border-amber-500/40 hover:border-amber-500/70',
    pillActiveBg: 'bg-amber-500 text-zinc-950 hover:bg-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-600 dark:text-amber-400',
    badgeBorder: 'border-amber-500/20',
  },
  recent: {
    id: 'recent',
    label: 'Recent',
    dotColor: 'bg-sky-400',
    pillBorder: 'border-sky-500/40 hover:border-sky-500/70',
    pillActiveBg: 'bg-sky-500 text-zinc-950 hover:bg-sky-400',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-600 dark:text-sky-400',
    badgeBorder: 'border-sky-500/20',
  },
  dev: {
    id: 'dev',
    label: 'Developer',
    dotColor: 'bg-emerald-400',
    pillBorder: 'border-emerald-400/40 hover:border-emerald-400/70',
    pillActiveBg: 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    badgeBorder: 'border-emerald-500/20',
  },
  text: {
    id: 'text',
    label: 'Text & Code',
    dotColor: 'bg-violet-400',
    pillBorder: 'border-violet-400/40 hover:border-violet-400/70',
    pillActiveBg: 'bg-violet-500 text-white hover:bg-violet-600',
    badgeBg: 'bg-violet-500/10',
    badgeText: 'text-violet-600 dark:text-violet-400',
    badgeBorder: 'border-violet-500/20',
  },
  image: {
    id: 'image',
    label: 'Image & Media',
    dotColor: 'bg-rose-400',
    pillBorder: 'border-rose-400/40 hover:border-rose-400/70',
    pillActiveBg: 'bg-rose-500 text-white hover:bg-rose-600',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-600 dark:text-rose-400',
    badgeBorder: 'border-rose-500/20',
  },
  'video-audio': {
    id: 'video-audio',
    label: 'Video & Audio',
    dotColor: 'bg-orange-400',
    pillBorder: 'border-orange-400/40 hover:border-orange-400/70',
    pillActiveBg: 'bg-orange-500 text-white hover:bg-orange-600',
    badgeBg: 'bg-orange-500/10',
    badgeText: 'text-orange-600 dark:text-orange-400',
    badgeBorder: 'border-orange-500/20',
  },
  document: {
    id: 'document',
    label: 'Document & PDF',
    dotColor: 'bg-indigo-400',
    pillBorder: 'border-indigo-400/40 hover:border-indigo-400/70',
    pillActiveBg: 'bg-indigo-500 text-white hover:bg-indigo-600',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    badgeBorder: 'border-indigo-500/20',
  },
  security: {
    id: 'security',
    label: 'Security & Crypto',
    dotColor: 'bg-red-400',
    pillBorder: 'border-red-400/40 hover:border-red-400/70',
    pillActiveBg: 'bg-red-500 text-white hover:bg-red-600',
    badgeBg: 'bg-red-500/10',
    badgeText: 'text-red-600 dark:text-red-400',
    badgeBorder: 'border-red-500/20',
  },
  'math-finance': {
    id: 'math-finance',
    label: 'Math & Finance',
    dotColor: 'bg-teal-400',
    pillBorder: 'border-teal-400/40 hover:border-teal-400/70',
    pillActiveBg: 'bg-teal-500 text-white hover:bg-teal-600',
    badgeBg: 'bg-teal-500/10',
    badgeText: 'text-teal-600 dark:text-teal-400',
    badgeBorder: 'border-teal-500/20',
  },
  time: {
    id: 'time',
    label: 'Time & Date',
    dotColor: 'bg-lime-400',
    pillBorder: 'border-lime-400/40 hover:border-lime-400/70',
    pillActiveBg: 'bg-lime-500 text-zinc-950 hover:bg-lime-400',
    badgeBg: 'bg-lime-500/10',
    badgeText: 'text-lime-600 dark:text-lime-400',
    badgeBorder: 'border-lime-500/20',
  },
  generators: {
    id: 'generators',
    label: 'Generators',
    dotColor: 'bg-fuchsia-400',
    pillBorder: 'border-fuchsia-400/40 hover:border-fuchsia-400/70',
    pillActiveBg: 'bg-fuchsia-500 text-white hover:bg-fuchsia-600',
    badgeBg: 'bg-fuchsia-500/10',
    badgeText: 'text-fuchsia-600 dark:text-fuchsia-400',
    badgeBorder: 'border-fuchsia-500/20',
  },
  'unit-converter': {
    id: 'unit-converter',
    label: 'Unit Converters',
    dotColor: 'bg-blue-400',
    pillBorder: 'border-blue-400/40 hover:border-blue-400/70',
    pillActiveBg: 'bg-blue-500 text-white hover:bg-blue-600',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-600 dark:text-blue-400',
    badgeBorder: 'border-blue-500/20',
  },
  'games-edu': {
    id: 'games-edu',
    label: 'Games & Edu',
    dotColor: 'bg-cyan-400',
    pillBorder: 'border-cyan-400/40 hover:border-cyan-400/70',
    pillActiveBg: 'bg-cyan-500 text-zinc-950 hover:bg-cyan-400',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
    badgeBorder: 'border-cyan-500/20',
  },
};

export const TOOL_CATEGORIES_KEYS: ToolCategory[] = [
  'dev',
  'text',
  'image',
  'video-audio',
  'document',
  'security',
  'math-finance',
  'time',
  'generators',
  'unit-converter',
  'games-edu',
];

export const ALL_FILTER_KEYS: CategoryFilterKey[] = [
  'all',
  'favorites',
  'recent',
  ...TOOL_CATEGORIES_KEYS,
];

export function getCategoryConfig(key: string): CategoryConfig {
  return (
    CATEGORIES_MAP[key as CategoryFilterKey] || {
      id: key as CategoryFilterKey,
      label: key,
      dotColor: 'bg-emerald-500',
      pillBorder: 'border-border/80',
      pillActiveBg: 'bg-emerald-500 text-zinc-950',
      badgeBg: 'bg-muted/60',
      badgeText: 'text-muted-foreground',
      badgeBorder: 'border-border/40',
    }
  );
}