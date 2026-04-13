"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPKR } from "@/utils/formatPKR";
import { useCart } from "@/hooks/useCart";

export type ProductCardModel = {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category?: string;
};

export default function ProductCard({
  product,
}: {
  product: ProductCardModel;
}) {
  const image = product.images?.[0] ?? "/placeholder.png";
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group rounded-3xl border border-black/5 bg-white/70 p-4 shadow-sm shadow-black/5 backdrop-blur transition hover:shadow-lg hover:shadow-black/10 dark:bg-black/20 dark:shadow-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5">
        {/* unoptimized avoids Next image domain config during early development */}
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 50vw, 33vw"
          unoptimized
        />
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            {product.category ? (
              <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                {product.category}
              </div>
            ) : null}
            <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              {product.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-300">
              {product.description ?? "Premium pick for your loved one."}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Price
            </div>
            <div className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
              {formatPKR(product.price)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={`/products/${product.id}`}
            className="inline-flex h-10 items-center justify-center rounded-2xl bg-primary/10 px-4 text-sm font-semibold text-primary transition hover:bg-primary/15"
          >
            View details
          </Link>
          <button
            type="button"
            onClick={() =>
              addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                image,
              })
            }
            className="inline-flex cursor-pointer h-10 items-center justify-center rounded-2xl border border-black/10 bg-white/80 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:bg-black/20 dark:text-zinc-100"
          >
            Add to cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
