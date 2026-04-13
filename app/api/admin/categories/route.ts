import { NextResponse } from "next/server";
import { createCategory, getCategories } from "@/models/category";
import { requireAdminApi } from "@/lib/require-admin-api";

export async function GET() {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { name?: string; description?: string };
  const name = body.name?.trim();
  const description = body.description?.trim();

  if (!name) {
    return NextResponse.json({ message: "Category name is required." }, { status: 400 });
  }

  try {
    const category = await createCategory({
      name,
      description,
      createdBy: session.email,
    });
    return NextResponse.json({ ok: true, category });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create category.";
    return NextResponse.json({ message }, { status: 400 });
  }
}

