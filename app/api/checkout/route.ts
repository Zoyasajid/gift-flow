import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getOrderById } from "@/models/order";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderId: string;
      items: { name: string; price: number; quantity: number }[];
    };

    if (!body.orderId) {
      return NextResponse.json(
        { message: "Order ID is required." },
        { status: 400 },
      );
    }

    const order = await getOrderById(body.orderId);
    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 },
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { message: "Items are required." },
        { status: 400 },
      );
    }

    const origin = new URL(request.url).origin;

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      currency: "pkr",
      line_items: body.items.map((item) => ({
        price_data: {
          currency: "pkr",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: body.orderId,
      },
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { message: "Unable to create payment session." },
      { status: 500 },
    );
  }
}
