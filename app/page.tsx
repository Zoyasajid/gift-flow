import Hero from "@/components/Hero";
import { Skeleton } from "@/components/Skeleton";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-white to-transparent dark:from-black dark:via-black">
      <Hero />

      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
              Curated for every occasion
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Premium picks with PKR pricing and gift-ready delivery details.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-white"
          >
            Explore all products
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-black/5 bg-white/60 p-4">
              <Skeleton className="h-44 w-full rounded-2xl" />
              <div className="mt-4 space-y-3">
                <Skeleton className="h-4 w-3/4 rounded-xl" />
                <Skeleton className="h-4 w-2/3 rounded-xl" />
                <Skeleton className="mt-2 h-10 w-full rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
