import ProductCard, { ProductCardModel } from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import { getProducts } from "@/models/product";

export default async function ProductsPage() {
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

  return (
    <AnimatedSection className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Products
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Browse premium gifts with PKR pricing and gift-ready delivery
            details.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-xs text-zinc-600">
            Categories:{" "}
            {Array.from(
              new Set(
                products
                  .map((p) => p.category)
                  .filter((c): c is string => Boolean(c)),
              ),
            ).join(", ")}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </AnimatedSection>
  );
}
