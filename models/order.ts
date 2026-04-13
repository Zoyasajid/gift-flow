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

export type OrderRecord = {
  id: string;
  customer?: { name?: string };
  items?: { name?: string; price?: number; quantity?: number }[];
  total?: number;
  status?: string;
  createdAt?: { toDate?: () => Date };
  [key: string]: unknown;
};

export async function getOrders(): Promise<OrderRecord[]> {
  const db = getDb();
  const snapshot = await db
    .collection("orders")
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<OrderRecord, "id">;
    return { id: doc.id, ...data };
  });
}
