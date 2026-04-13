"use client";

import { useEffect, useState } from "react";
import { formatPKR } from "@/utils/formatPKR";

type Product = {
  id: string;
  title: string;
  category: string;
  specification: string;
  price: number;
  stock: number;
};

export default function AdminProductsList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/products", { cache: "no-store" });
        const data = (await res.json()) as { products?: Product[]; message?: string };
        if (!res.ok) {
          throw new Error(data.message ?? "Unable to load products.");
        }
        if (!cancelled) {
          setProducts(data.products ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Unable to load products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-6 rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 backdrop-blur">
      <div className="text-sm font-semibold text-zinc-950 dark:text-white">Products list</div>
      {loading ? <p className="mt-4 text-sm text-zinc-600">Loading...</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {!loading && !error ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
          <div className="grid grid-cols-4 bg-black/5 px-4 py-2 text-xs font-semibold text-zinc-600">
            <div>Title</div>
            <div>Category</div>
            <div>Price</div>
            <div>Stock</div>
          </div>
          {products.length === 0 ? (
            <p className="px-4 py-4 text-sm text-zinc-600">No products added yet.</p>
          ) : (
            products.map((product, index) => (
              <div
                key={product.id}
                className={[
                  "grid grid-cols-4 items-center px-4 py-3 text-sm",
                  index !== products.length - 1 ? "border-b border-black/10" : "",
                ].join(" ")}
              >
                <div className="pr-2">
                  <div className="font-semibold text-zinc-950">{product.title}</div>
                  <div className="mt-1 line-clamp-1 text-xs text-zinc-500">
                    {product.specification}
                  </div>
                </div>
                <div className="text-zinc-700">{product.category}</div>
                <div className="font-semibold text-zinc-950">{formatPKR(product.price)}</div>
                <div className="text-zinc-700">{product.stock}</div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

