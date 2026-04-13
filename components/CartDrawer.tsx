"use client";

import { useMemo } from "react";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  cartCount?: number;
};

export default function CartDrawer({ open, onClose, cartCount = 0 }: CartDrawerProps) {
  const ariaHidden = useMemo(() => (!open ? true : undefined), [open]);

  return (
    <>
      <div
        aria-hidden={ariaHidden}
        className={[
          "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
      />
      <aside
        aria-hidden={ariaHidden}
        className={[
          "fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-black/5 bg-white/90 backdrop-blur transition-transform dark:bg-black/60",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
          <div>
            <div className="text-sm font-semibold text-zinc-950 dark:text-white">
              Your cart
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {cartCount} items
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-semibold hover:bg-white dark:border-white/10 dark:bg-black/30"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="px-4 py-6">
          <div className="rounded-3xl border border-black/5 bg-white p-5 text-sm text-zinc-600 dark:border-white/10 dark:bg-black/20 dark:text-zinc-300">
            Cart functionality will be connected to `localStorage` next.
          </div>

          <div className="mt-4 grid gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-3xl bg-black/5 animate-pulse dark:bg-white/10" />
            ))}
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="w-full rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
              disabled
            >
              Continue to checkout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

