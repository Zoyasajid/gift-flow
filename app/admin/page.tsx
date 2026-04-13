import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";

const stats = [
  {
    label: "Total Orders",
    value: "128",
    change: "+12%",
    href: "/admin/orders",
  },
  { label: "Products", value: "34", change: "+3", href: "/admin/products" },
  {
    label: "Revenue",
    value: "PKR 842,500",
    change: "+18%",
    href: "/admin/orders",
  },
  {
    label: "Pending",
    value: "7",
    change: "needs action",
    href: "/admin/orders",
  },
];

const recentOrders = [
  {
    id: "ORD-1042",
    customer: "Ayesha Khan",
    amount: "PKR 6,500",
    status: "Delivered",
    date: "Apr 12, 2026",
  },
  {
    id: "ORD-1041",
    customer: "Omar Farooq",
    amount: "PKR 9,900",
    status: "Shipped",
    date: "Apr 11, 2026",
  },
  {
    id: "ORD-1040",
    customer: "Sara Ahmed",
    amount: "PKR 4,200",
    status: "Processing",
    date: "Apr 11, 2026",
  },
  {
    id: "ORD-1039",
    customer: "Ali Raza",
    amount: "PKR 3,100",
    status: "Delivered",
    date: "Apr 10, 2026",
  },
  {
    id: "ORD-1038",
    customer: "Hina Malik",
    amount: "PKR 5,300",
    status: "Pending",
    date: "Apr 10, 2026",
  },
  {
    id: "ORD-1037",
    customer: "Bilal Sheikh",
    amount: "PKR 3,700",
    status: "Delivered",
    date: "Apr 9, 2026",
  },
];

const statusColor: Record<string, string> = {
  Delivered:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Processing:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Pending: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

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
            Manage orders, products, and stock.
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
            href="/admin/categories"
            className="inline-flex h-10 items-center justify-center rounded-2xl bg-primary/10 px-4 text-sm font-semibold text-primary transition hover:bg-primary/20"
          >
            Categories
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
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-[2rem] border border-black/5 bg-white/70 p-5 shadow-sm shadow-black/5 backdrop-blur transition hover:shadow-md"
          >
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
              {stat.value}
            </div>
            <div className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              {stat.change}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 backdrop-blur">
        <div className="text-sm font-semibold text-zinc-950 dark:text-white">
          Recent orders
        </div>
        <div className="mt-4 grid gap-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 dark:bg-black/20"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-xs font-bold text-primary">
                  {order.customer
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {order.customer}
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {order.id} · {order.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColor[order.status] ?? ""}`}
                >
                  {order.status}
                </span>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {order.amount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
