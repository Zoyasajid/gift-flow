import { requireAdmin } from "@/lib/require-admin";
import AdminProductsManager from "@/components/AdminProductsManager";

export default async function AdminProductsPage() {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
          Products
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Manage all products — create, edit, and view stock.
        </p>
      </div>
      <AdminProductsManager />
    </div>
  );
}
