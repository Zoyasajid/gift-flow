import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import AdminProductCreateForm from "@/components/AdminProductCreateForm";

export default async function AdminNewProductPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Add New Product
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Choose an existing category or create a new one while adding product.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white/80 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-white"
        >
          Back to Products List
        </Link>
      </div>

      <AdminProductCreateForm />
    </div>
  );
}

