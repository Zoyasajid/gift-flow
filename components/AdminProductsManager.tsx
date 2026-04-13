"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatPKR } from "@/utils/formatPKR";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

type Product = {
  id: string;
  title: string;
  category: string;
  specification: string;
  price: number;
  stock: number;
};

export default function AdminProductsManager() {
  type CategoryMode = "existing" | "new";

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [categoryMode, setCategoryMode] = useState<CategoryMode>("existing");

  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    specification: "",
    price: "",
    stock: "0",
    image: "",
    categoryId: "",
    newCategoryName: "",
    newCategoryDescription: "",
  });

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [catsRes, productsRes] = await Promise.all([
        fetch("/api/admin/categories", { cache: "no-store" }),
        fetch("/api/admin/products", { cache: "no-store" }),
      ]);

      if (!catsRes.ok || !productsRes.ok) {
        throw new Error("Unable to load admin data.");
      }

      const catsJson = (await catsRes.json()) as { categories: Category[] };
      const productsJson = (await productsRes.json()) as { products: Product[] };
      setCategories(catsJson.categories);
      setProducts(productsJson.products);
      if (!productForm.categoryId && catsJson.categories[0]?.id) {
        setProductForm((prev) => ({ ...prev, categoryId: catsJson.categories[0].id }));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unable to load admin data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createCategoryForProduct() {
    const name = productForm.newCategoryName.trim();
    if (!name) throw new Error("Please enter a new category name.");

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: productForm.newCategoryDescription.trim(),
      }),
    });
    const data = (await res.json()) as { message?: string; category?: { id: string } };
    if (!res.ok || !data.category?.id) {
      throw new Error(data.message ?? "Unable to create category.");
    }
    return data.category.id;
  }

  async function onCreateProduct(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      let categoryId = productForm.categoryId;
      if (categoryMode === "new") {
        categoryId = await createCategoryForProduct();
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
          categoryId,
        }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message ?? "Unable to create product.");
      setProductForm((prev) => ({
        ...prev,
        title: "",
        description: "",
        specification: "",
        price: "",
        stock: "0",
        image: "",
        categoryId: categories[0]?.id ?? "",
        newCategoryName: "",
        newCategoryDescription: "",
      }));
      setMessage("Product created successfully.");
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create product.");
    }
  }

  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 backdrop-blur">
        <div className="text-sm font-semibold text-zinc-950 dark:text-white">Products list</div>
        {loading ? (
          <p className="mt-4 text-sm text-zinc-600">Loading...</p>
        ) : (
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
                    <div className="mt-1 text-xs text-zinc-500 line-clamp-1">
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
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 backdrop-blur">
          <div className="text-sm font-semibold text-zinc-950">Create product in category</div>
          <form className="mt-4 grid gap-3" onSubmit={onCreateProduct}>
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-black/10 bg-white/80 p-1">
              <button
                type="button"
                onClick={() => setCategoryMode("existing")}
                className={[
                  "h-10 rounded-xl text-sm font-semibold transition",
                  categoryMode === "existing"
                    ? "bg-primary/10 text-primary"
                    : "text-zinc-600 hover:bg-black/5",
                ].join(" ")}
              >
                Use Existing Category
              </button>
              <button
                type="button"
                onClick={() => setCategoryMode("new")}
                className={[
                  "h-10 rounded-xl text-sm font-semibold transition",
                  categoryMode === "new"
                    ? "bg-primary/10 text-primary"
                    : "text-zinc-600 hover:bg-black/5",
                ].join(" ")}
              >
                Create New Category
              </button>
            </div>

            {categoryMode === "existing" ? (
              <select
                value={productForm.categoryId}
                onChange={(e) => setProductForm((v) => ({ ...v, categoryId: e.target.value }))}
                className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <input
                  value={productForm.newCategoryName}
                  onChange={(e) =>
                    setProductForm((v) => ({ ...v, newCategoryName: e.target.value }))
                  }
                  placeholder="New category name (e.g. Cake)"
                  className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  required
                />
                <input
                  value={productForm.newCategoryDescription}
                  onChange={(e) =>
                    setProductForm((v) => ({ ...v, newCategoryDescription: e.target.value }))
                  }
                  placeholder="New category description (optional)"
                  className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                />
              </>
            )}

            <input
              value={productForm.title}
              onChange={(e) => setProductForm((v) => ({ ...v, title: e.target.value }))}
              placeholder="Title"
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              required
            />
            <input
              value={productForm.image}
              onChange={(e) => setProductForm((v) => ({ ...v, image: e.target.value }))}
              placeholder="Image URL"
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              required
            />
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm((v) => ({ ...v, description: e.target.value }))}
              placeholder="Description"
              className="min-h-20 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              required
            />
            <textarea
              value={productForm.specification}
              onChange={(e) => setProductForm((v) => ({ ...v, specification: e.target.value }))}
              placeholder="Specification"
              className="min-h-20 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={productForm.price}
                onChange={(e) => setProductForm((v) => ({ ...v, price: e.target.value }))}
                type="number"
                min={1}
                placeholder="Price (PKR)"
                className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                required
              />
              <input
                value={productForm.stock}
                onChange={(e) => setProductForm((v) => ({ ...v, stock: e.target.value }))}
                type="number"
                min={0}
                placeholder="Stock"
                className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <button className="h-11 rounded-2xl bg-primary text-sm font-semibold text-white hover:bg-indigo-600">
              Add product
            </button>
          </form>
        </div>

        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    </div>
  );
}

