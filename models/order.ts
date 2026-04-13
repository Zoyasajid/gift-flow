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

