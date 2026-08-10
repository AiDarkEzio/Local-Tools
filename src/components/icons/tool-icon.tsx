import * as React from "react";
import {
  FileJson,
  Binary,
  Code2,
  Image as ImageIcon,
  Scaling,
  Palette,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  FileText,
  FileCode,
  FileSpreadsheet,
  QrCode,
  Fingerprint,
  AlignLeft,
  GitCompare,
  Type,
  BarChart3,
  Clock,
  CalendarClock,
  Globe2,
  Scissors,
  Film,
  Percent,
  Landmark,
  Ruler,
  HardDrive,
  Pipette,
  Keyboard,
  BookOpen,
  Terminal,
  LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  FileJson,
  Binary,
  Code2,
  Image: ImageIcon,
  Scaling,
  Palette,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  FileText,
  FileCode,
  FileSpreadsheet,
  QrCode,
  Fingerprint,
  AlignLeft,
  GitCompare,
  Type,
  BarChart3,
  Clock,
  CalendarClock,
  Globe2,
  Scissors,
  Film,
  Percent,
  Landmark,
  Ruler,
  HardDrive,
  Pipette,
  Keyboard,
  BookOpen,
};

interface ToolIconProps extends LucideProps {
  name: string;
}

export function ToolIcon({ name, className = "w-5 h-5", ...props }: ToolIconProps) {
  const IconComponent = ICON_MAP[name] || Terminal;
  return <IconComponent className={className} {...props} />;
}