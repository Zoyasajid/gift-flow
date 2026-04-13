import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12">
      <div className="rounded-[2rem] border border-black/5 bg-white/70 p-8 text-center shadow-sm shadow-black/5 backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10">
          <div className="text-2xl">✓</div>
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-zinc-950 dark:text-white">
          Order placed successfully
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          This is a mock success page. Next step: create a real order in MongoDB.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Continue shopping
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white/80 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-white"
          >
            Track order (admin)
          </Link>
        </div>
      </div>
    </div>
  );
}

