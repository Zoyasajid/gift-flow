import Link from "next/link";
import { Skeleton } from "@/components/Skeleton";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminDashboardPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Manage orders, products, and stock. (UI placeholder)
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="inline-flex h-10 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white/80 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-white"
          >
            Orders
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[2rem] border border-black/5 bg-white/70 p-5 shadow-sm shadow-black/5 backdrop-blur"
          >
            <Skeleton className="h-4 w-24 rounded-xl" />
            <div className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-white">
              <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
            <Skeleton className="mt-3 h-10 w-full rounded-2xl" />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 backdrop-blur">
        <div className="text-sm font-semibold text-zinc-950 dark:text-white">
          Recent orders
        </div>
        <div className="mt-4 grid gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 dark:bg-black/20"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-black/5 dark:bg-white/10" />
                <div>
                  <Skeleton className="h-4 w-36 rounded-xl" />
                  <Skeleton className="mt-2 h-3 w-24 rounded-xl" />
                </div>
              </div>
              <Skeleton className="h-8 w-24 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

