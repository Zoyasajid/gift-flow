"use client";

import { useState } from "react";
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/hooks/useCart";
import { formatPKR } from "@/utils/formatPKR";

export default function CartPageClient() {
  const [open, setOpen] = useState(false);
  const { items, cartTotal, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Cart
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {items.length} items in your cart
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-white"
            onClick={() => setOpen(true)}
          >
            Open cart drawer
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.4fr]">
        <div className="grid gap-3">
          {items.length === 0 ? (
            <div className="rounded-[2rem] border border-black/5 bg-white/70 p-8 text-center shadow-sm shadow-black/5 backdrop-blur">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Your cart is empty.{" "}
                <Link href="/products" className="text-primary hover:underline">
                  Browse products
                </Link>
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-[2rem] border border-black/5 bg-white/70 p-4 shadow-sm shadow-black/5 backdrop-blur dark:bg-black/20"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="mt-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {item.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="h-7 w-7 rounded-lg border border-black/10 text-sm hover:bg-black/5"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="h-7 w-7 rounded-lg border border-black/10 text-sm hover:bg-black/5"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-zinc-950 dark:text-white">
                    {formatPKR(item.price * item.quantity)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="mt-1 text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-5 shadow-sm shadow-black/5 backdrop-blur h-fit">
          <div className="text-sm font-semibold text-zinc-950 dark:text-white">
            Order summary
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-300">
              <span>Subtotal</span>
              <span>{formatPKR(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-300">
              <span>Shipping</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
            <div className="border-t border-black/10 pt-2 mt-2 flex justify-between">
              <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                Total
              </span>
              <span className="text-lg font-bold text-zinc-950 dark:text-white">
                {formatPKR(cartTotal)}
              </span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
