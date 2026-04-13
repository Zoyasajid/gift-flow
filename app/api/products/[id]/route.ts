import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/models/product";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const products = await getProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { message: "Unable to load product." },
      { status: 500 },
    );
  }
}
