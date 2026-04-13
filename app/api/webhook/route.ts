import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { updateOrderPayment } from "@/models/order";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !endpointSecret) {
    return NextResponse.json(
      { message: "Missing signature or webhook secret." },
      { status: 400 },
    );
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { message: "Invalid signature." },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await updateOrderPayment(orderId, {
          status: "Paid",
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : undefined,
        });
      } catch (err) {
        console.error("Failed to update order payment status:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
