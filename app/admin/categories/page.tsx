"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Edit state ──
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  async function loadCategories() {
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { categories: Category[] };
      setCategories(data.categories);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Category name is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          description: description.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok) {
        setError(data.message ?? "Failed to create category.");
        return;
      }
      setSuccess(`Category "${trimmed}" created!`);
      setName("");
      setDescription("");
      await loadCategories();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function startEditCat(cat: Category) {
    setEditingCat(cat);
    setEditName(cat.name);
    setEditDesc(cat.description || "");
    setError("");
    setSuccess("");
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCat) return;
    setError("");
    setSuccess("");
    setEditSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCat.id,
          name: editName.trim(),
          description: editDesc.trim(),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok) {
        setError(data.message ?? "Failed to update category.");
        return;
      }
      setSuccess(`Category updated!`);
      setEditingCat(null);
      await loadCategories();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setEditSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
            Categories
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Manage product categories.
          </p>
        </div>
      </div>

      {/* ── Add category form ── */}
      <div className="mt-8 rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-sm shadow-black/5 backdrop-blur dark:bg-black/20">
        <div className="text-sm font-semibold text-zinc-950 dark:text-white">
          Add new category
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto]"
        >
          <label className="text-sm font-semibold text-zinc-900 dark:text-white">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:bg-black/20"
              placeholder="e.g. Birthday"
            />
          </label>

          <label className="text-sm font-semibold text-zinc-900 dark:text-white">
            Description (optional)
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:bg-black/20"
              placeholder="Short description"
            />
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
            >
              {submitting ? "Adding…" : "Add category"}
            </button>
          </div>
        </form>

        {error ? (
          <div className="mt-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
            {success}
          </div>
        ) : null}
      </div>

      {/* ── Category list ── */}
      <div className="mt-8 rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 backdrop-blur dark:bg-black/20">
        <div className="text-sm font-semibold text-zinc-950 dark:text-white">
          All categories
        </div>

        {loading ? (
          <div className="mt-4 grid gap-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-14 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            No categories yet. Add one above.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 dark:bg-black/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                    {cat.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {cat.name}
                    </div>
                    {cat.description ? (
                      <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {cat.description}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-zinc-400 dark:text-zinc-500">
                    /{cat.slug}
                  </div>
                  <button
                    type="button"
                    onClick={() => startEditCat(cat)}
                    className="inline-flex h-8 items-center justify-center rounded-xl bg-primary/10 px-3 text-xs font-semibold text-primary transition hover:bg-primary/20"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit category panel ── */}
      {editingCat ? (
        <div className="mt-8 rounded-[2rem] border border-primary/20 bg-primary/5 p-6 shadow-sm shadow-black/5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-950 dark:text-white">
              Edit: {editingCat.name}
            </div>
            <button
              type="button"
              onClick={() => setEditingCat(null)}
              className="text-xs text-zinc-500 hover:text-zinc-700"
            >
              Cancel
            </button>
          </div>
          <form
            onSubmit={handleEditSubmit}
            className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto]"
          >
            <label className="text-sm font-semibold text-zinc-900 dark:text-white">
              Name
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:bg-black/20"
                required
              />
            </label>
            <label className="text-sm font-semibold text-zinc-900 dark:text-white">
              Description
              <input
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20 dark:bg-black/20"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={editSubmitting}
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
              >
                {editSubmitting ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
