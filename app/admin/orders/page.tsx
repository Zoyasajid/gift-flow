import { Skeleton } from "@/components/Skeleton";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminOrdersPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
        Manage Orders
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        View all orders and update status. (UI placeholder)
      </p>

      <div className="mt-8 rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 backdrop-blur">
        <div className="text-sm font-semibold text-zinc-950 dark:text-white">
          Orders
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
          <div className="grid grid-cols-4 gap-2 bg-black/5 px-4 py-3 text-xs font-semibold text-zinc-600">
            <div>Order</div>
            <div>Status</div>
            <div>Total</div>
            <div>Action</div>
          </div>
          <div className="divide-y divide-black/10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-2 px-4 py-4 text-sm dark:bg-black/20"
              >
                <div className="font-semibold text-zinc-950 dark:text-white">
                  #GF-00{i + 1}
                </div>
                <div className="text-zinc-600 dark:text-zinc-300">
                  <Skeleton className="h-8 w-28 rounded-xl" />
                </div>
                <div className="text-zinc-950 dark:text-white">
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
                <div>
                  <Skeleton className="h-9 w-24 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

