import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function getCategories(): Promise<CategoryRecord[]> {
  const db = getDb();
  const snapshot = await db
    .collection("categories")
    .orderBy("name", "asc")
    .get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<CategoryRecord, "id">;
    return { id: doc.id, ...data };
  });
}

export async function createCategory(input: {
  name: string;
  description?: string;
  createdBy: string;
}) {
  const db = getDb();
  const name = input.name.trim();
  const slug = slugify(name);
  const ref = db.collection("categories").doc(slug);
  const existing = await ref.get();
  if (existing.exists) {
    throw new Error("Category already exists.");
  }

  await ref.set({
    name,
    slug,
    description: input.description?.trim() || "",
    createdBy: input.createdBy,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return {
    id: ref.id,
    name,
    slug,
    description: input.description?.trim() || "",
  };
}

export async function updateCategory(
  id: string,
  input: { name?: string; description?: string },
) {
  const db = getDb();
  const ref = db.collection("categories").doc(id);
  const doc = await ref.get();
  if (!doc.exists) {
    throw new Error("Category not found.");
  }

  const updates: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (input.name !== undefined) {
    updates.name = input.name.trim();
  }
  if (input.description !== undefined) {
    updates.description = input.description.trim();
  }

  await ref.update(updates);
  const updated = await ref.get();
  const data = updated.data() as Omit<CategoryRecord, "id">;
  return { id: updated.id, ...data };
}
