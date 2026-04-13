"use client";

import { FormEvent, useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

type CategoryMode = "existing" | "new";

export default function AdminProductCreateForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryMode, setCategoryMode] = useState<CategoryMode>("existing");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
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

  useEffect(() => {
    let cancelled = false;
    async function loadCategories() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/categories", { cache: "no-store" });
        const data = (await res.json()) as { categories?: Category[] };
        if (!res.ok) throw new Error("Unable to load categories.");
        if (!cancelled) {
          const list = data.categories ?? [];
          setCategories(list);
          if (!form.categoryId && list[0]?.id) {
            setForm((prev) => ({ ...prev, categoryId: list[0].id }));
          }
        }
      } catch {
        if (!cancelled) setError("Unable to load categories.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, [form.categoryId]);

  async function createCategory() {
    const name = form.newCategoryName.trim();
    if (!name) throw new Error("Please enter a new category name.");

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: form.newCategoryDescription.trim(),
      }),
    });
    const data = (await res.json()) as { message?: string; category?: { id: string } };
    if (!res.ok || !data.category?.id) {
      throw new Error(data.message ?? "Unable to create category.");
    }
    return data.category.id;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      let categoryId = form.categoryId;
      if (categoryMode === "new") {
        categoryId = await createCategory();
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoryId,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message ?? "Unable to create product.");

      setForm((prev) => ({
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create product.");
    }
  }

  return (
    <div className="mt-6 rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 backdrop-blur">
      <div className="text-sm font-semibold text-zinc-950">Add new product</div>
      <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
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
            value={form.categoryId}
            onChange={(e) => setForm((v) => ({ ...v, categoryId: e.target.value }))}
            className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            required
            disabled={loading}
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
              value={form.newCategoryName}
              onChange={(e) => setForm((v) => ({ ...v, newCategoryName: e.target.value }))}
              placeholder="New category name (e.g. Cake)"
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              required
            />
            <input
              value={form.newCategoryDescription}
              onChange={(e) =>
                setForm((v) => ({ ...v, newCategoryDescription: e.target.value }))
              }
              placeholder="New category description (optional)"
              className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            />
          </>
        )}

        <input
          value={form.title}
          onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))}
          placeholder="Title"
          className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          required
        />
        <input
          value={form.image}
          onChange={(e) => setForm((v) => ({ ...v, image: e.target.value }))}
          placeholder="Image URL"
          className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
          placeholder="Description"
          className="min-h-20 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          required
        />
        <textarea
          value={form.specification}
          onChange={(e) => setForm((v) => ({ ...v, specification: e.target.value }))}
          placeholder="Specification"
          className="min-h-20 rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={form.price}
            onChange={(e) => setForm((v) => ({ ...v, price: e.target.value }))}
            type="number"
            min={1}
            placeholder="Price (PKR)"
            className="h-11 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            required
          />
          <input
            value={form.stock}
            onChange={(e) => setForm((v) => ({ ...v, stock: e.target.value }))}
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

      {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

