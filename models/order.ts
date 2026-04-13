import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";

type CreateOrderInput = Record<string, unknown>;

// Firebase-backed order create.
export async function createOrder(input: CreateOrderInput = {}) {
  const db = getDb();
  const ref = await db.collection("orders").add({
    ...input,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const created = await ref.get();
  return { id: created.id, ...created.data() };
}

export async function updateOrderPayment(
  orderId: string,
  data: {
    status: string;
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
  },
) {
  const db = getDb();
  const ref = db.collection("orders").doc(orderId);
  await ref.update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function getOrderById(orderId: string) {
  const db = getDb();
  const doc = await db.collection("orders").doc(orderId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as Record<string, unknown>) };
}
