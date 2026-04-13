import { requireAdmin } from "@/lib/require-admin";

const orders = [
  { id: "GF-001", customer: "Ayesha Khan", status: "Delivered", total: "PKR 6,500", date: "Apr 12, 2026" },
  { id: "GF-002", customer: "Omar Farooq", status: "Shipped", total: "PKR 9,900", date: "Apr 11, 2026" },
  { id: "GF-003", customer: "Sara Ahmed", status: "Processing", total: "PKR 4,200", date: "Apr 11, 2026" },
  { id: "GF-004", customer: "Ali Raza", status: "Delivered", total: "PKR 3,100", date: "Apr 10, 2026" },
  { id: "GF-005", customer: "Hina Malik", status: "Pending", total: "PKR 5,300", date: "Apr 10, 2026" },
  { id: "GF-006", customer: "Bilal Sheikh", status: "Delivered", total: "PKR 3,700", date: "Apr 9, 2026" },
  { id: "GF-007", customer: "Fatima Noor", status: "Shipped", total: "PKR 7,800", date: "Apr 8, 2026" },
  { id: "GF-008", customer: "Usman Tariq", status: "Pending", total: "PKR 2,400", date: "Apr 7, 2026" },
];

const statusColor: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Pending: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default async function AdminOrdersPage() {
  await requireAdmin();

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
          Orders
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
          <div className="grid grid-cols-5 gap-2 bg-black/5 px-4 py-3 text-xs font-semibold text-zinc-600">
            <div>Order</div>
            <div>Customer</div>
            <div>Status</div>
            <div>Total</div>
            <div>Date</div>
          </div>
          <div className="divide-y divide-black/10">
            {orders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-5 items-center gap-2 px-4 py-4 text-sm dark:bg-black/20"
              >
                <div className="font-semibold text-zinc-950 dark:text-white">
                  #{order.id}
                </div>
                <div className="text-zinc-700 dark:text-zinc-300">
                  {order.customer}
                </div>
                <div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColor[order.status] ?? ""}`}>
                    {order.status}
                  </span>
                </div>
                <div className="font-semibold text-zinc-950 dark:text-white">
                  {order.total}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {order.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

