"use client";
import React, { useRef, useState } from "react";
import { ModalDialog } from "./ModalDialog";
import { Tabs, TabItem } from "./Tabs";
import { Disclosure } from "./Disclosure";

const SAMPLE_TABS: readonly TabItem[] = [
  { id: "overview", label: "Overview", content: "Use Left/Right Arrow, Home, and End keys to switch tabs." },
  { id: "aria", label: "ARIA Contract", content: "Implements role=tablist, role=tab with aria-selected, and role=tabpanel." },
  { id: "focus", label: "Focus Model", content: "Roving tabIndex keeps only the active tab in the Tab order." },
];

export function PlaygroundDemo() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const openBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">1. Hand-Built Modal Dialog</h2>
        <button ref={openBtnRef} type="button" onClick={() => setModalOpen(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
          Open Accessible Modal
        </button>
        <ModalDialog isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Keyboard Focus Trap Demo" description="Press Tab/Shift+Tab to cycle focus, or Escape to close." triggerRef={openBtnRef}>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded border border-slate-600 px-3 py-1.5 text-sm">Cancel</button>
            <button type="button" onClick={() => setModalOpen(false)} className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white">Confirm</button>
          </div>
        </ModalDialog>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">2. Hand-Built W3C Tabs</h2>
        <Tabs ariaLabel="Accessibility patterns" items={SAMPLE_TABS} />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">3. Hand-Built Disclosure</h2>
        <Disclosure summary="How does keyboard activation work?">
          Native button elements automatically trigger on both Enter and Space while updating aria-expanded.
        </Disclosure>
      </section>
    </div>
  );
}
