// src\config\tools.ts

import { ToolTag } from "./tags";

export type ToolCategory =
  | 'text'        // Plain text, diff checkers, case converters, word counts
  | 'image'       // Crop, resize, compress, image format conversion
  | 'video-audio' // Combine video & audio tools (FFmpeg Wasm tools)
  | 'document'    // PDF, Markdown, CSV, Excel, Word tools
  | 'dev'         // JSON, Base64, RegEx, SQL, HTML/CSS utilities
  | 'security'    // Passwords, hashing, encryption, JWT decoders
  | 'math-finance'// Calculators, currency, interest, percentage
  | 'time'        // Timezones, timestamps, stopwatches, countdowns
  | 'generators'  // QR Codes, Barcodes, UUIDs, Lorem Ipsum
  | 'unit-converter' // Mass, speed, distance, temperature units
  | 'games-edu'   // Typing test, flashcards, simple web games
;

export type GridSpan = '1x1' | '2x1' | '1x2' | '2x2';

export interface Tool {
  id: string;          // Unique identifier (e.g., 'json-formatter')
  name: string;        // Display title
  description: string; // Short SEO summary
  category: ToolCategory;
  path: string;        // Route path (e.g., '/tools/json-formatter')
  icon: string;        // Lucide icon key
  tags: ToolTag[];     // Strictly typed tags from KNOWN_TAGS

  // Visual & Feature Indicators
  isNew?: boolean;     // Visual 'New' badge indicator
  featured?: boolean;  // Promoted in Hero / Featured Bento section

  // Bento Grid Layout & Ordering
  gridSpan?: GridSpan; // Occupancy in Bento Grid (default: '1x1')
  order?: number;      // Custom display priority (lower numbers rank higher)
}

export const TOOLS: Tool[] = [
];