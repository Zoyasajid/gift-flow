import { requireAdmin } from "@/lib/require-admin";
import Link from "next/link";
import AdminProductsList from "@/components/AdminProductsList";

export default async function AdminProductsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Products List
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            View all products and stock numbers.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Add New Product
        </Link>
      </div>
      <AdminProductsList />
    </div>
  );
}

