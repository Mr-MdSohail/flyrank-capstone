# Accessibility Playground — Hand-Built vs. shadcn/ui Analysis

After building `ModalDialog.tsx`, `Tabs.tsx`, and `Disclosure.tsx` by hand against the W3C ARIA Authoring Practices Guide and inspecting the generated `src/components/ui/dialog.tsx` and `src/components/ui/tabs.tsx` components (backed by Radix UI primitives), several concrete gaps stood out:

## 1. Portal Rendering & Background Inertness (Modal Dialog)
- **My implementation (`playground/ModalDialog.tsx`):** Renders inline in the parent DOM tree and relies on a manual `keydown` listener for `Tab`/`Shift+Tab` cycling. If an ancestor has `overflow: hidden` or a lower `z-index` stacking context, the modal can clip. Furthermore, screen reader virtual cursors (browse mode) can still navigate outside the dialog unless sibling DOM nodes are marked `inert` / `aria-hidden="true"`.
- **shadcn/ui (`src/components/ui/dialog.tsx`):** Uses `DialogPrimitive.Portal` to mount the overlay and content directly at `document.body`, automatically applies `aria-hidden` / `inert` to background siblings, locks body scroll, and supports `showCloseButton` and `DialogFooter` composition slots out of the box.

## 2. Orientation, RTL Support & Activation Modes (Tabs)
- **My implementation (`playground/Tabs.tsx`):** Hardcodes horizontal `ArrowLeft` and `ArrowRight` navigation with automatic activation on focus, and assumes left-to-right (LTR) reading order.
- **shadcn/ui (`src/components/ui/tabs.tsx`):** Exposes an `orientation` prop (`horizontal` | `vertical`) that switches keyboard listeners between Left/Right and Up/Down arrows, sets `aria-orientation`, respects document `dir="rtl"` automatically, and supports both automatic and manual tab activation modes.

## 3. Declarative Ref & Event Composition
In my hand-built modal, the caller must manually create and pass `triggerRef` so focus can return on close. shadcn/ui's `DialogTrigger` wraps any trigger element with `asChild` ref forwarding, tracking the opener element internally without extra boilerplate in parent components.