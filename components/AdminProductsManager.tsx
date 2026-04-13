"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
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
  name?: string;
  category: string;
  categoryId?: string;
  specification: string;
  description?: string;
  price: number;
  stock: number;
  images?: string[];
};

/* ── shared input classes ── */
const inputCls =
  "h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20";
const textareaCls =
  "min-h-20 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20";

/* ── Modal shell ── */
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-black/5 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-black/5 hover:text-zinc-700"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminProductsManager() {
  type CategoryMode = "existing" | "new";

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [categoryMode, setCategoryMode] = useState<CategoryMode>("existing");

  /* ── Modal visibility ── */
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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

  // ── Edit state ──
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    specification: "",
    price: "",
    stock: "0",
    image: "",
    categoryId: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

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
      const productsJson = (await productsRes.json()) as {
        products: Product[];
      };
      setCategories(catsJson.categories);
      setProducts(productsJson.products);
      if (!productForm.categoryId && catsJson.categories[0]?.id) {
        setProductForm((prev) => ({
          ...prev,
          categoryId: catsJson.categories[0].id,
        }));
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
    const data = (await res.json()) as {
      message?: string;
      category?: { id: string };
    };
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
      setShowAddModal(false);
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create product.");
    }
  }

  function startEdit(product: Product) {
    setEditingProduct(product);
    setEditForm({
      title: product.title || "",
      description: product.description || "",
      specification: product.specification || "",
      price: String(product.price),
      stock: String(product.stock),
      image: product.images?.[0] || "",
      categoryId: product.categoryId || "",
    });
    setMessage("");
    setError("");
    setShowEditModal(true);
  }

  async function onUpdateProduct(e: FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;
    setMessage("");
    setError("");
    setEditSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id,
          title: editForm.title,
          description: editForm.description,
          specification: editForm.specification,
          price: Number(editForm.price),
          stock: Number(editForm.stock),
          image: editForm.image,
          categoryId: editForm.categoryId || undefined,
        }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message ?? "Unable to update product.");
      setMessage("Product updated successfully.");
      setEditingProduct(null);
      setShowEditModal(false);
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update product.");
    } finally {
      setEditSubmitting(false);
    }
  }

  return (
    <>
      {/* ── Header with Add button ── */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {message ? (
            <p className="text-sm text-emerald-700">{message}</p>
          ) : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => {
            setMessage("");
            setError("");
            setShowAddModal(true);
          }}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-indigo-600"
        >
          + Add Product
        </button>
      </div>

      {/* ── Products list (full width) ── */}
      <div className="mt-4 rounded-[2rem] border border-black/5 bg-white/60 p-6 shadow-sm shadow-black/5 backdrop-blur">
        {loading ? (
          <p className="text-sm text-zinc-600">Loading...</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-black/10">
            <div className="grid grid-cols-5 bg-black/5 px-4 py-2 text-xs font-semibold text-zinc-600">
              <div>Title</div>
              <div>Category</div>
              <div>Price</div>
              <div>Stock</div>
              <div>Action</div>
            </div>
            {products.length === 0 ? (
              <p className="px-4 py-4 text-sm text-zinc-600">
                No products added yet.
              </p>
            ) : (
              products.map((product, index) => (
                <div
                  key={product.id}
                  className={[
                    "grid grid-cols-5 items-center px-4 py-3 text-sm",
                    index !== products.length - 1
                      ? "border-b border-black/10"
                      : "",
                  ].join(" ")}
                >
                  <div className="pr-2">
                    <div className="font-semibold text-zinc-950">
                      {product.title}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500 line-clamp-1">
                      {product.specification}
                    </div>
                  </div>
                  <div className="text-zinc-700">{product.category}</div>
                  <div className="font-semibold text-zinc-950">
                    {formatPKR(product.price)}
                  </div>
                  <div className="text-zinc-700">{product.stock}</div>
                  <div>
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="inline-flex h-8 items-center justify-center rounded-xl bg-primary/10 px-3 text-xs font-semibold text-primary transition hover:bg-primary/20"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── Add Product Modal ── */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
      >
        <form className="grid gap-3" onSubmit={onCreateProduct}>
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
              Existing Category
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
              New Category
            </button>
          </div>

          {categoryMode === "existing" ? (
            <select
              value={productForm.categoryId}
              onChange={(e) =>
                setProductForm((v) => ({ ...v, categoryId: e.target.value }))
              }
              className={inputCls}
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
                  setProductForm((v) => ({
                    ...v,
                    newCategoryName: e.target.value,
                  }))
                }
                placeholder="New category name (e.g. Cake)"
                className={inputCls}
                required
              />
              <input
                value={productForm.newCategoryDescription}
                onChange={(e) =>
                  setProductForm((v) => ({
                    ...v,
                    newCategoryDescription: e.target.value,
                  }))
                }
                placeholder="New category description (optional)"
                className={inputCls}
              />
            </>
          )}

          <input
            value={productForm.title}
            onChange={(e) =>
              setProductForm((v) => ({ ...v, title: e.target.value }))
            }
            placeholder="Title"
            className={inputCls}
            required
          />
          <input
            value={productForm.image}
            onChange={(e) =>
              setProductForm((v) => ({ ...v, image: e.target.value }))
            }
            placeholder="Image URL"
            className={inputCls}
            required
          />
          <textarea
            value={productForm.description}
            onChange={(e) =>
              setProductForm((v) => ({ ...v, description: e.target.value }))
            }
            placeholder="Description"
            className={textareaCls}
            required
          />
          <textarea
            value={productForm.specification}
            onChange={(e) =>
              setProductForm((v) => ({ ...v, specification: e.target.value }))
            }
            placeholder="Specification"
            className={textareaCls}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={productForm.price}
              onChange={(e) =>
                setProductForm((v) => ({ ...v, price: e.target.value }))
              }
              type="number"
              min={1}
              placeholder="Price (PKR)"
              className={inputCls}
              required
            />
            <input
              value={productForm.stock}
              onChange={(e) =>
                setProductForm((v) => ({ ...v, stock: e.target.value }))
              }
              type="number"
              min={0}
              placeholder="Stock"
              className={inputCls}
              required
            />
          </div>
          {error && showAddModal ? (
            <p className="text-sm text-red-700">{error}</p>
          ) : null}
          <button className="h-11 rounded-2xl bg-primary text-sm font-semibold text-white hover:bg-indigo-600">
            Add product
          </button>
        </form>
      </Modal>

      {/* ── Edit Product Modal ── */}
      <Modal
        open={showEditModal && !!editingProduct}
        onClose={() => {
          setShowEditModal(false);
          setEditingProduct(null);
        }}
        title={`Edit: ${editingProduct?.title ?? "Product"}`}
      >
        <form className="grid gap-3" onSubmit={onUpdateProduct}>
          <select
            value={editForm.categoryId}
            onChange={(e) =>
              setEditForm((v) => ({ ...v, categoryId: e.target.value }))
            }
            className={inputCls}
          >
            <option value="">Keep current category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            value={editForm.title}
            onChange={(e) =>
              setEditForm((v) => ({ ...v, title: e.target.value }))
            }
            placeholder="Title"
            className={inputCls}
            required
          />
          <input
            value={editForm.image}
            onChange={(e) =>
              setEditForm((v) => ({ ...v, image: e.target.value }))
            }
            placeholder="Image URL"
            className={inputCls}
          />
          <textarea
            value={editForm.description}
            onChange={(e) =>
              setEditForm((v) => ({ ...v, description: e.target.value }))
            }
            placeholder="Description"
            className={textareaCls}
          />
          <textarea
            value={editForm.specification}
            onChange={(e) =>
              setEditForm((v) => ({ ...v, specification: e.target.value }))
            }
            placeholder="Specification"
            className={textareaCls}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={editForm.price}
              onChange={(e) =>
                setEditForm((v) => ({ ...v, price: e.target.value }))
              }
              type="number"
              min={1}
              placeholder="Price (PKR)"
              className={inputCls}
              required
            />
            <input
              value={editForm.stock}
              onChange={(e) =>
                setEditForm((v) => ({ ...v, stock: e.target.value }))
              }
              type="number"
              min={0}
              placeholder="Stock"
              className={inputCls}
              required
            />
          </div>
          {error && showEditModal ? (
            <p className="text-sm text-red-700">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={editSubmitting}
            className="h-11 rounded-2xl bg-primary text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60"
          >
            {editSubmitting ? "Saving…" : "Save changes"}
          </button>
        </form>
      </Modal>
    </>
  );
}
