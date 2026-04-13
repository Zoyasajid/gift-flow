import { requireAdmin } from "@/lib/require-admin";
import { getOrders } from "@/models/order";
import { formatPKR } from "@/utils/formatPKR";

const statusColor: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Delivered:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Processing:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Pending: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await getOrders();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
        Manage Orders
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        View all orders and update status.
      </p>

      <div className="mt-8 rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 backdrop-blur">
        <div className="text-sm font-semibold text-zinc-950 dark:text-white">
          Orders ({orders.length})
        </div>

        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
            <div className="grid grid-cols-5 gap-2 bg-black/5 px-4 py-3 text-xs font-semibold text-zinc-600">
              <div>Order</div>
              <div>Customer</div>
              <div>Status</div>
              <div>Total</div>
              <div>Date</div>
            </div>
            <div className="divide-y divide-black/10">
              {orders.map((order) => {
                const customerName = order.customer?.name ?? "Unknown";
                const status = order.status ?? "Pending";
                const total = order.total ?? 0;
                const date = order.createdAt?.toDate?.()
                  ? order.createdAt.toDate().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—";

                return (
                  <div
                    key={order.id}
                    className="grid grid-cols-5 items-center gap-2 px-4 py-4 text-sm dark:bg-black/20"
                  >
                    <div className="font-semibold text-zinc-950 dark:text-white">
                      #{order.id.slice(0, 8)}
                    </div>
                    <div className="text-zinc-700 dark:text-zinc-300">
                      {customerName}
                    </div>
                    <div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColor[status] ?? statusColor.Pending}`}
                      >
                        {status}
                      </span>
                    </div>
                    <div className="font-semibold text-zinc-950 dark:text-white">
                      {formatPKR(total)}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {date}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
