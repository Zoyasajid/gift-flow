import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";

export type ProductRecord = {
  id: string;
  name: string;
  title: string;
  description: string;
  specification: string;
  price: number;
  stock: number;
  category: string;
  categoryId: string;
  images: string[];
};

export async function getProducts(): Promise<ProductRecord[]> {
  const db = getDb();
  const snapshot = await db
    .collection("products")
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<ProductRecord, "id">;
    return { id: doc.id, ...data };
  });
}

export async function createProduct(input: {
  title: string;
  description: string;
  specification: string;
  price: number;
  image: string;
  categoryId: string;
  stock?: number;
  createdBy: string;
}) {
  const db = getDb();

  const categoryDoc = await db
    .collection("categories")
    .doc(input.categoryId)
    .get();
  if (!categoryDoc.exists) {
    throw new Error("Selected category does not exist.");
  }
  const category = categoryDoc.data() as { name: string };

  const payload = {
    title: input.title.trim(),
    name: input.title.trim(),
    description: input.description.trim(),
    specification: input.specification.trim(),
    price: input.price,
    stock: input.stock ?? 0,
    category: category.name,
    categoryId: input.categoryId,
    images: [input.image.trim()],
    createdBy: input.createdBy,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  const ref = await db.collection("products").add(payload);
  return { id: ref.id, ...payload };
}

export async function updateProduct(
  id: string,
  input: {
    title?: string;
    description?: string;
    specification?: string;
    price?: number;
    image?: string;
    categoryId?: string;
    stock?: number;
  },
) {
  const db = getDb();
  const ref = db.collection("products").doc(id);
  const doc = await ref.get();
  if (!doc.exists) {
    throw new Error("Product not found.");
  }

  const updates: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (input.title !== undefined) {
    updates.title = input.title.trim();
    updates.name = input.title.trim();
  }
  if (input.description !== undefined) {
    updates.description = input.description.trim();
  }
  if (input.specification !== undefined) {
    updates.specification = input.specification.trim();
  }
  if (input.price !== undefined) {
    updates.price = input.price;
  }
  if (input.stock !== undefined) {
    updates.stock = input.stock;
  }
  if (input.image !== undefined) {
    updates.images = [input.image.trim()];
  }
  if (input.categoryId !== undefined) {
    const catDoc = await db
      .collection("categories")
      .doc(input.categoryId)
      .get();
    if (!catDoc.exists) throw new Error("Selected category does not exist.");
    const cat = catDoc.data() as { name: string };
    updates.category = cat.name;
    updates.categoryId = input.categoryId;
  }

  await ref.update(updates);
  const updated = await ref.get();
  return { id: updated.id, ...(updated.data() as Omit<ProductRecord, "id">) };
}
