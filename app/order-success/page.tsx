import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { getOrderById } from "@/models/order";
import { formatPKR } from "@/utils/formatPKR";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderCustomer = {
  name: string;
};

type OrderRecipient = {
  name?: string;
  deliveryDate?: string;
  messageCard?: string;
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let order: Record<string, unknown> | null = null;

  if (session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      const orderId = session.metadata?.orderId;
      if (orderId) {
        order = await getOrderById(orderId);
      }
    } catch {
      // Stripe session invalid or expired — show generic success
    }
  }

  const items = (order?.items as OrderItem[] | undefined) ?? [];
  const customer = order?.customer as OrderCustomer | undefined;
  const recipient = order?.recipient as OrderRecipient | undefined;
  const total =
    typeof order?.total === "number"
      ? order.total
      : items.reduce((s, i) => s + i.price * i.quantity, 0);
  const orderId = typeof order?.id === "string" ? order.id : undefined;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-12">
      <div className="rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-sm shadow-black/5 backdrop-blur">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 dark:bg-emerald-900/30">
            <div className="text-2xl text-emerald-600">✓</div>
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-zinc-950 dark:text-white">
            Payment successful
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {orderId ? (
              <>
                Order{" "}
                <span className="font-semibold text-primary">#{orderId}</span>{" "}
                has been confirmed. We&apos;ll start preparing it right away.
              </>
            ) : (
              "Your order has been confirmed. Thank you for your purchase!"
            )}
          </p>
        </div>

        {items.length > 0 && (
          <div className="mx-auto mt-8 max-w-lg">
            <div className="rounded-2xl border border-black/5 bg-white/60 p-5 dark:bg-black/20">
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Order summary
              </div>
              <div className="mt-3 space-y-2">
                {items.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {item.name}{" "}
                      <span className="text-zinc-400">×{item.quantity}</span>
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-black/10 pt-2">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    {formatPKR(total)}
                  </span>
                </div>
              </div>
            </div>

            {(customer || recipient) && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {customer?.name && (
                  <div className="rounded-2xl border border-black/5 bg-white/60 p-4 dark:bg-black/20">
                    <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      Ordered by
                    </div>
                    <div className="mt-1 text-sm font-semibold text-zinc-950 dark:text-white">
                      {customer.name}
                    </div>
                  </div>
                )}
                {recipient?.name && (
                  <div className="rounded-2xl border border-black/5 bg-white/60 p-4 dark:bg-black/20">
                    <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                      Delivering to
                    </div>
                    <div className="mt-1 text-sm font-semibold text-zinc-950 dark:text-white">
                      {recipient.name}
                    </div>
                    {recipient.deliveryDate && (
                      <div className="mt-0.5 text-xs text-zinc-500">
                        {recipient.deliveryDate}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {recipient?.messageCard && (
              <div className="mt-4 rounded-2xl border border-black/5 bg-primary/5 p-4">
                <div className="text-[11px] font-medium text-zinc-500">
                  Gift message
                </div>
                <div className="mt-1 text-sm italic text-zinc-700 dark:text-zinc-300">
                  &ldquo;{recipient.messageCard}&rdquo;
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white/80 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
