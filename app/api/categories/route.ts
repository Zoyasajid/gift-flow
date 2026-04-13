import { NextResponse } from "next/server";
import { getCategories } from "@/models/category";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json(
      { message: "Unable to load categories." },
      { status: 500 },
    );
  }
}
