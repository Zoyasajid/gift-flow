"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatPKR } from "@/utils/formatPKR";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, cartTotal, removeFromCart } = useCart();
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-black/5 bg-white/90 backdrop-blur dark:bg-black/60"
          >
            <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Your cart
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {items.length} items
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

            <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 py-4">
              <div className="grid gap-3">
                {items.length === 0 ? (
                  <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Your cart is empty
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/70 p-3 dark:bg-black/20"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                          {item.name}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-zinc-950 dark:text-white">
                        {formatPKR(item.price * item.quantity)}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between rounded-2xl bg-black/5 px-4 py-3 dark:bg-white/5">
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    Total
                  </span>
                  <span className="text-lg font-bold text-zinc-950 dark:text-white">
                    {formatPKR(cartTotal)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
                >
                  Continue to checkout
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
