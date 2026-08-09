// src\config\tags.ts

// Runtime array (used for UI filter buttons, drop downs, search)
export const KNOWN_TAGS = [
  'converter',
  'generator',
  'calculator',
  'validator',
  'formatter',
  'compressor',
  'encoder-decoder',
  'editor',
  'viewer',
  'checker',
  'parser',
  'pdf',
  'unit',
] as const;

export type ToolTag = typeof KNOWN_TAGS[number];