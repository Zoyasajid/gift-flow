import { NextResponse } from "next/server";
import { createOrder } from "@/models/order";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderBody = {
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items: OrderItem[];
  sendAsGift: boolean;
  recipient?: {
    name: string;
    address: string;
    deliveryDate: string;
    messageCard?: string;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderBody;

    // Validate customer
    const customerName = body.customer?.name;
    console.log(customerName, "customerName");
    if (!customerName) {
      return NextResponse.json(
        { message: "Customer name is required." },
        { status: 400 },
      );
    }

    // Validate items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { message: "At least one item is required." },
        { status: 400 },
      );
    }

    for (const item of body.items) {
      if (!item.productId || !item.name || !item.price || !item.quantity) {
        return NextResponse.json(
          {
            message:
              "Each item must have productId, name, price, and quantity.",
          },
          { status: 400 },
        );
      }
      if (item.quantity < 1 || item.price <= 0) {
        return NextResponse.json(
          { message: "Item quantity must be >= 1 and price must be > 0." },
          { status: 400 },
        );
      }
    }

    // Validate gift recipient if sendAsGift
    if (body.sendAsGift) {
      if (
        !body.recipient?.name?.trim() ||
        !body.recipient?.address?.trim() ||
        !body.recipient?.deliveryDate?.trim()
      ) {
        return NextResponse.json(
          {
            message:
              "Recipient name, address, and delivery date are required for gift orders.",
          },
          { status: 400 },
        );
      }
    }

    const total = body.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = await createOrder({
      customer: {
        name: customerName,
        email: body.customer.email?.trim() ?? "",
        phone: body.customer.phone?.trim() ?? "",
        address: body.customer.address?.trim() ?? "",
      },
      items: body.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      status: "Pending",
      sendAsGift: Boolean(body.sendAsGift),
      recipient: body.sendAsGift
        ? {
            name: body.recipient!.name.trim(),
            address: body.recipient!.address.trim(),
            deliveryDate: body.recipient!.deliveryDate.trim(),
            messageCard: body.recipient!.messageCard?.trim() ?? "",
          }
        : null,
    });

    return NextResponse.json({ ok: true, order });
  } catch {
    return NextResponse.json(
      { message: "Unable to place order." },
      { status: 500 },
    );
  }
}
