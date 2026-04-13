import ProductCard, { ProductCardModel } from "@/components/ProductCard";
import { getProducts } from "@/models/product";

const fallbackProducts: ProductCardModel[] = [
  {
    id: "p1",
    name: "Indulgent Chocolate & Flowers Box",
    description: "Dark chocolates with fresh florals for a special someone.",
    price: 6500,
    category: "For Her",
    images: [
      "https://images.unsplash.com/photo-1524626292031-172f050d2954?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "p2",
    name: "Signature Fragrance Duo",
    description: "Minimal, gender-neutral fragrance set with premium notes.",
    price: 4200,
    category: "Anniversary",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "p3",
    name: "Artisanal Sweet Treats Box",
    description: "A curated selection of sweets for birthdays and celebrations.",
    price: 3100,
    category: "Birthday",
    images: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "p4",
    name: "Minimal Desk Gift Set",
    description: "Notebook, pen and candle for a refined workspace.",
    price: 9900,
    category: "Corporate",
    images: [
      "https://images.unsplash.com/photo-1557825835-70d97c4aa06a?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "p5",
    name: "Cozy Blanket & Mug Set",
    description: "Perfect for winter evenings and comfort gifting.",
    price: 3700,
    category: "Get Well Soon",
    images: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "p6",
    name: "Classic Roses Arrangement",
    description: "Timeless roses with a modern presentation box.",
    price: 5300,
    category: "Romantic",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

export default async function ProductsPage() {
  let products: ProductCardModel[] = fallbackProducts;
  try {
    const dbProducts = await getProducts();
    if (dbProducts.length > 0) {
      products = dbProducts.map((p) => ({
        id: p.id,
        name: p.title || p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        images: p.images,
      }));
    }
  } catch {
    // Keep fallback data when Firebase is not configured yet.
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Products
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Browse premium gifts with PKR pricing and gift-ready delivery details.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-xs text-zinc-600">
            Categories:{" "}
            {Array.from(
              new Set(products.map((p) => p.category).filter((c): c is string => Boolean(c)))
            ).join(", ")}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

