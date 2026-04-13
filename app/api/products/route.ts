import { NextResponse } from "next/server";
import { getProducts } from "@/models/product";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json(
      { message: "Unable to load products." },
      { status: 500 },
    );
  }
}
