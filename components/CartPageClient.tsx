"use client";

import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";

export default function CartPageClient() {
  const [open, setOpen] = useState(true);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Cart
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Add items from product pages. Gift details are captured at checkout.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-white"
            onClick={() => setOpen(true)}
          >
            Open cart
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-black/5 bg-white/60 p-5 backdrop-blur dark:bg-black/20">
        <div className="text-sm font-semibold text-zinc-950 dark:text-white">
          Cart drawer
        </div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          This will connect to `localStorage` next.
        </div>
      </div>

      <CartDrawer open={open} onClose={() => setOpen(false)} cartCount={0} />
    </div>
  );
}

