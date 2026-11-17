"use client";
import React, { useId, useState } from "react";

export interface DisclosureProps {
  summary: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Disclosure({ summary, defaultOpen = false, children }: DisclosureProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-100 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-blue-500"
        >
          <span>{summary}</span>
          <span aria-hidden="true" className="text-xs text-slate-400">{expanded ? "▲" : "▼"}</span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!expanded} className="border-t border-slate-800 px-4 py-3 text-sm text-slate-300">
        {children}
      </div>
    </div>
  );
}
