"use client";

import { useEffect, useState } from "react";
import { formatPKR } from "@/utils/formatPKR";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock?: number;
  specification?: string;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = (await res.json()) as { product: Product };
        setProduct(data.product);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-[2rem] bg-black/5 dark:bg-white/5" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
            <div className="h-6 w-1/3 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
            <div className="h-20 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 text-center">
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
          Product not found
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          This product may have been removed or doesn&apos;t exist.
        </p>
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          Browse products
        </button>
      </div>
    );
  }

  const displayName = product.title || product.name;
  const mainImage = product.images?.[0] ?? "/placeholder.png";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-4 shadow-sm shadow-black/5 backdrop-blur">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-black/5">
            <Image
              src={mainImage}
              alt={displayName}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {product.images.map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl border border-black/5 bg-white/70"
              />
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-sm shadow-black/5 backdrop-blur">
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <span>Product details</span>
            {product.category ? (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                {product.category}
              </span>
            ) : null}
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
            {displayName}
          </h1>
          <div className="mt-3 text-3xl font-semibold text-primary">
            {formatPKR(product.price)}
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {product.description}
          </p>

          <div className="mt-6 rounded-2xl border border-black/5 bg-white/60 p-4">
            <div className="text-xs font-semibold text-zinc-500">Stock</div>
            <div className="mt-1 text-sm font-semibold text-zinc-950">
              {product.stock != null && product.stock > 0
                ? `${product.stock} in stock`
                : "In stock"}
            </div>
            {product.specification ? (
              <div className="mt-2 text-xs text-zinc-500">
                {product.specification}
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() =>
                addToCart({
                  productId: product.id,
                  name: displayName,
                  price: product.price,
                  image: mainImage,
                })
              }
              className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart({
                  productId: product.id,
                  name: displayName,
                  price: product.price,
                  image: mainImage,
                });
                router.push("/checkout");
              }}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white/80 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-white"
            >
              Buy now
            </button>
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold text-zinc-500">
              Recommended
            </div>
            <div className="mt-3 rounded-3xl border border-black/5 bg-white/60 p-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                More curated picks coming soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
