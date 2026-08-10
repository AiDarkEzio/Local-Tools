// src/components/icons/logo-icon.tsx
import React from "react";

export function LogoIcon({ className = "h-5 w-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="4" className="fill-emerald-500/10 stroke-emerald-500" />
      <path d="m9 10 2 2-2 2" className="stroke-emerald-500" />
      <path d="M13 14h2" className="stroke-emerald-500" />
    </svg>
  );
}