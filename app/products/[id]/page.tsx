import { formatPKR } from "@/utils/formatPKR";
import { Skeleton } from "@/components/Skeleton";
import Image from "next/image";

type Props = {
  params: { id: string };
};

export default function ProductDetailPage({ params }: Props) {
  // Placeholder. Next step: fetch by id from Prisma.
  const product = {
    id: params.id,
    name: "Premium Gift Item",
    description: "A curated product pick with gift-ready details.",
    price: 6500,
    category: "Gift",
    images: [
      "https://images.unsplash.com/photo-1512427691650-1e0c2f9a81b3?auto=format&fit=crop&w=900&q=80",
    ],
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-4 shadow-sm shadow-black/5 backdrop-blur">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-black/5">
            <Image
              src={product.images[0]}
              alt={product.name}
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
            {product.name}
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
              In stock
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              We’ll connect inventory to MongoDB next.
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              disabled
              className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white opacity-70"
            >
              Add to cart (soon)
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-black/10 bg-white/80 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-white"
            >
              Buy now
            </button>
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold text-zinc-500">Recommended</div>
            <div className="mt-3 rounded-3xl border border-black/5 bg-white/60 p-4">
              <Skeleton className="h-14 w-2/3 rounded-2xl" />
              <Skeleton className="mt-3 h-10 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

