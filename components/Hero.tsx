"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute -top-24 left-1/2 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="absolute -bottom-28 right-[-12rem] h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-10 sm:pt-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs text-zinc-600 backdrop-blur dark:bg-black/20 dark:text-zinc-300"
            >
              <span className="h-2 w-2 rounded-full bg-primary" />
              Apple + Stripe inspired gifting experience
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="mt-5 text-balance text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl"
            >
              Send premium gifts in seconds.
              <span className="text-primary"> GiftFlow</span> handles the rest.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="mt-4 max-w-xl text-pretty text-zinc-600 dark:text-zinc-300"
            >
              Browse curated products, add a personal message, and schedule
              delivery with gift-ready details — all in PKR.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                Browse products
              </Link>
              <Link
                href="/checkout"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white/80 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:bg-black/20 dark:text-zinc-100"
              >
                How it works
              </Link>
            </motion.div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: "Gift-ready checkout",
                  desc: "Recipient details included",
                },
                {
                  title: "Transparent PKR totals",
                  desc: "No currency confusion",
                },
                { title: "Fast, premium UX", desc: "Smooth interactions" },
              ].map((b, i) => (
                <motion.div
                  key={b.title}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={4 + i}
                  className="rounded-2xl border border-black/5 bg-white/70 p-4 backdrop-blur dark:bg-black/20"
                >
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {b.title}
                  </div>
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                    {b.desc}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            className="lg:pl-8"
          >
            <div className="relative rounded-[2rem] border border-black/5 bg-gradient-to-b from-white/80 to-white/40 p-5 shadow-sm shadow-black/5 backdrop-blur dark:from-black/25 dark:to-black/10">
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-white to-white p-5 dark:via-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      Featured pickup
                    </div>
                    <div className="mt-1 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                      Gift cards that feel personal
                    </div>
                  </div>
                  <div className="rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                    PKR pricing
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Recipient name", value: "Ayesha" },
                    { label: "Delivery date", value: "Thu" },
                    { label: "Message card", value: "You made my day" },
                    { label: "Total", value: "6,500" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-black/5 bg-white/70 p-3 dark:bg-black/20"
                    >
                      <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                        {item.label}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-black/5">
                  <div className="h-full w-2/3 rounded-full bg-primary transition-all" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/5 bg-white/70 p-4 dark:bg-black/20">
                  <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Premium UI
                  </div>
                  <div className="mt-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    Rounded corners & subtle motion
                  </div>
                </div>
                <div className="rounded-2xl border border-black/5 bg-white/70 p-4 dark:bg-black/20">
                  <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    Smooth checkout
                  </div>
                  <div className="mt-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    Gift toggle + recipient details
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
              Tip: Use the product pages to connect the “Send as Gift” flow
              next.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
