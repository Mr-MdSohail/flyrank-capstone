"use client";
import React, { useId, useRef, useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: readonly TabItem[];
  ariaLabel: string;
  defaultIndex?: number;
}

export function Tabs({ items, ariaLabel, defaultIndex = 0 }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const focusTab = (index: number) => {
    const wrapped = (index + items.length) % items.length;
    setActiveIndex(wrapped);
    tabRefs.current[wrapped]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusTab(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(items.length - 1);
    }
  };

  return (
    <div>
      <div role="tablist" aria-label={ariaLabel} className="flex gap-1 border-b border-slate-700">
        {items.map((item, idx) => {
          const selected = idx === activeIndex;
          const tabId = `${baseId}-tab-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;
          return (
            <button
              key={item.id}
              ref={(el) => { tabRefs.current[idx] = el; }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`rounded-t-md px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-500 ${selected ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item, idx) => {
        const selected = idx === activeIndex;
        const tabId = `${baseId}-tab-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;
        return (
          <div
            key={item.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            tabIndex={0}
            hidden={!selected}
            className="rounded-b-lg border border-t-0 border-slate-700 bg-slate-900 p-4 text-sm text-slate-200"
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
