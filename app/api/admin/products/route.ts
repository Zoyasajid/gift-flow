import { NextResponse } from "next/server";
import { createProduct, getProducts, updateProduct } from "@/models/product";
import { requireAdminApi } from "@/lib/require-admin-api";

export async function GET() {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    description?: string;
    specification?: string;
    price?: number;
    image?: string;
    categoryId?: string;
    stock?: number;
  };

  const title = body.title?.trim();
  const description = body.description?.trim();
  const specification = body.specification?.trim();
  const image = body.image?.trim();
  const categoryId = body.categoryId?.trim();
  const price = Number(body.price);
  const stock = Number(body.stock ?? 0);

  if (!title || !description || !specification || !image || !categoryId) {
    return NextResponse.json(
      {
        message:
          "Title, description, specification, image and category are required.",
      },
      { status: 400 },
    );
  }

  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { message: "Price must be a positive number." },
      { status: 400 },
    );
  }

  if (!Number.isFinite(stock) || stock < 0) {
    return NextResponse.json(
      { message: "Stock must be 0 or greater." },
      { status: 400 },
    );
  }

  try {
    const product = await createProduct({
      title,
      description,
      specification,
      image,
      categoryId,
      price,
      stock,
      createdBy: session.email,
    });
    return NextResponse.json({ ok: true, product });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create product.";
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: string;
    title?: string;
    description?: string;
    specification?: string;
    price?: number;
    image?: string;
    categoryId?: string;
    stock?: number;
  };

  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json(
      { message: "Product ID is required." },
      { status: 400 },
    );
  }

  if (
    body.price !== undefined &&
    (!Number.isFinite(body.price) || body.price <= 0)
  ) {
    return NextResponse.json(
      { message: "Price must be a positive number." },
      { status: 400 },
    );
  }

  if (
    body.stock !== undefined &&
    (!Number.isFinite(body.stock) || body.stock < 0)
  ) {
    return NextResponse.json(
      { message: "Stock must be 0 or greater." },
      { status: 400 },
    );
  }

  try {
    const product = await updateProduct(id, {
      title: body.title,
      description: body.description,
      specification: body.specification,
      price: body.price,
      image: body.image,
      categoryId: body.categoryId,
      stock: body.stock,
    });
    return NextResponse.json({ ok: true, product });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update product.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
