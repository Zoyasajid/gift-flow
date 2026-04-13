import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import type { ProductCardModel } from "@/components/ProductCard";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { getProducts } from "@/models/product";

export default async function Home() {
  let products: ProductCardModel[] = [];
  try {
    const dbProducts = await getProducts();
    products = dbProducts.map((p) => ({
      id: p.id,
      name: p.title || p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      images: p.images,
    }));
  } catch {
    // Keep empty when Firebase is not configured yet.
  }

  const featured = products.slice(0, 6);

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-white to-transparent dark:from-black dark:via-black">
      <Hero />

      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <AnimatedSection className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950 dark:text-white">
              Curated for every occasion
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Premium picks with PKR pricing and gift-ready delivery details.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-white"
          >
            Explore all products
          </Link>
        </AnimatedSection>

        {featured.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-sm text-zinc-500">
            No products available yet.
          </p>
        )}
      </section>
    </div>
  );
}
