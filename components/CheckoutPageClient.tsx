"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { formatPKR } from "@/utils/formatPKR";

type Step = 1 | 2;

export default function CheckoutPageClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const { items, cartTotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const totalAmount = cartTotal;

  const [sendAsGift, setSendAsGift] = useState(true);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [recipient, setRecipient] = useState({
    name: "",
    address: "",
    deliveryDate: "",
    messageCard: "",
  });

  const disabled = useMemo(() => {
    if (!customer.name.trim()) return true;
    if (sendAsGift) {
      if (!recipient.name.trim()) return true;
      if (!recipient.address.trim()) return true;
      if (!recipient.deliveryDate.trim()) return true;
    }
    return false;
  }, [
    customer.name,
    recipient.address,
    recipient.deliveryDate,
    recipient.name,
    sendAsGift,
  ]);

  async function onMockPay() {
    setSubmitting(true);
    try {
      // 1. Create the order in Firebase
      const orderBody: Record<string, unknown> = {
        customer: {
          name: customer.name.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
          address: customer.address.trim(),
        },
        sendAsGift: !!sendAsGift,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      };
      if (sendAsGift) {
        orderBody.recipient = {
          name: recipient.name.trim(),
          address: recipient.address.trim(),
          deliveryDate: recipient.deliveryDate,
          messageCard: recipient.messageCard.trim(),
        };
      }
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderBody),
      });
      const orderData = (await orderRes.json()) as {
        ok?: boolean;
        order?: { id: string };
        message?: string;
      };
      if (!orderRes.ok || !orderData.order?.id) {
        throw new Error(orderData.message ?? "Order failed");
      }

      // 2. Create Stripe Checkout Session
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.order.id,
          items: items.map((i) => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });
      const checkoutData = (await checkoutRes.json()) as {
        url?: string;
        message?: string;
      };
      if (!checkoutRes.ok || !checkoutData.url) {
        throw new Error(checkoutData.message ?? "Payment session failed");
      }

      // 3. Clear cart and redirect to Stripe
      clearCart();
      window.location.href = checkoutData.url;
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-sm shadow-black/5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
                Checkout
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                Premium, PKR-only checkout with optional gift delivery details.
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <div className="text-xs font-semibold text-zinc-500">Total</div>
              <div className="mt-1 text-xl font-bold text-zinc-950 dark:text-white">
                {formatPKR(totalAmount)}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {[1, 2].map((n) => {
              const active = step === n;
              const done = step > n;
              return (
                <button
                  key={n}
                  type="button"
                  disabled={!active && !done}
                  onClick={() => setStep(n as Step)}
                  className={[
                    "flex-1 rounded-2xl border px-3 py-2 text-left transition",
                    active
                      ? "border-primary/30 bg-primary/10"
                      : done
                        ? "border-black/10 bg-black/5"
                        : "border-black/10 bg-white/60",
                  ].join(" ")}
                >
                  <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    Step {n}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-zinc-950 dark:text-white">
                    {n === 1 ? "Details" : "Gift & Pay"}
                  </div>
                </button>
              );
            })}
          </div>

          {step === 1 ? (
            <div className="mt-6 grid gap-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Full name
                  <input
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, name: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:bg-black/20"
                    placeholder="e.g. Ayesha Khan"
                  />
                </label>
                <label className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Email (optional)
                  <input
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, email: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:bg-black/20"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Phone (optional)
                  <input
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, phone: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:bg-black/20"
                    placeholder="+92..."
                  />
                </label>
                <label className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Billing address
                  <input
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, address: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:bg-black/20"
                    placeholder="Street, area, city"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!customer.name.trim()}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
                >
                  Continue to gift & pay
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              <div className="flex items-center justify-between gap-4 rounded-3xl border border-black/10 bg-white/60 p-4">
                <div>
                  <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                    Send as Gift
                  </div>
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                    Add recipient details and a message card.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSendAsGift((v) => !v)}
                  className={[
                    "relative h-10 w-16 rounded-full border transition",
                    sendAsGift
                      ? "border-primary/30 bg-primary/15"
                      : "border-black/10 bg-black/5",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute left-1 top-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition dark:bg-black/30",
                      sendAsGift ? "translate-x-6" : "translate-x-0",
                    ].join(" ")}
                  >
                    {sendAsGift ? "✓" : "—"}
                  </span>
                </button>
              </div>

              {sendAsGift ? (
                <>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Recipient name
                      <input
                        value={recipient.name}
                        onChange={(e) =>
                          setRecipient((r) => ({ ...r, name: e.target.value }))
                        }
                        className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:bg-black/20"
                        placeholder="Recipient full name"
                      />
                    </label>
                    <label className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Delivery date
                      <input
                        type="date"
                        value={recipient.deliveryDate}
                        onChange={(e) =>
                          setRecipient((r) => ({
                            ...r,
                            deliveryDate: e.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:bg-black/20"
                      />
                    </label>
                  </div>
                  <label className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Recipient address
                    <input
                      value={recipient.address}
                      onChange={(e) =>
                        setRecipient((r) => ({ ...r, address: e.target.value }))
                      }
                      className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:bg-black/20"
                      placeholder="Street, area, city"
                    />
                  </label>
                  <label className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Message card text
                    <textarea
                      value={recipient.messageCard}
                      onChange={(e) =>
                        setRecipient((r) => ({
                          ...r,
                          messageCard: e.target.value,
                        }))
                      }
                      className="mt-2 w-full resize-none rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:bg-black/20"
                      placeholder="Write something thoughtful..."
                      rows={4}
                    />
                  </label>
                </>
              ) : (
                <div className="rounded-3xl border border-black/10 bg-white/60 p-4 text-sm text-zinc-600 dark:text-zinc-300">
                  Gift toggle is off. We’ll deliver to your billing details (to
                  be wired later).
                </div>
              )}

              <div className="rounded-3xl border border-black/10 bg-white/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                      Payment
                    </div>
                    <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                      Secure payment via Stripe.
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-zinc-500">
                      Amount
                    </div>
                    <div className="mt-1 text-lg font-bold text-zinc-950 dark:text-white">
                      {formatPKR(totalAmount)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onMockPay}
                  disabled={disabled || submitting || items.length === 0}
                  className="mt-4 w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
                >
                  {submitting ? "Redirecting to payment…" : "Pay with Stripe"}
                </button>
              </div>

              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-white"
                onClick={() => setStep(1)}
              >
                Back
              </button>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 backdrop-blur">
            <div className="text-sm font-semibold text-zinc-950 dark:text-white">
              Order summary
            </div>
            <div className="mt-4 rounded-3xl border border-black/10 bg-white/70 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Gift items
                </div>
                <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                  PKR
                </div>
              </div>
              <div className="mt-3 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-9 w-9 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        ×{item.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {formatPKR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-black/10 pt-4">
                <div className="flex items-center justify-between text-sm font-semibold text-zinc-950 dark:text-white">
                  Total
                  <span>{formatPKR(totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              {items.length === 0
                ? "Your cart is empty. Add items before checking out."
                : `${items.length} item${items.length !== 1 ? "s" : ""} in your cart.`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
