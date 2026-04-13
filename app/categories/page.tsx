import Link from "next/link";
import { getCategories, CategoryRecord } from "@/models/category";

const fallbackCategories: CategoryRecord[] = [
  {
    id: "for-her",
    name: "For Her",
    slug: "for-her",
    description: "Curated gifts perfect for the special women in your life.",
  },
  {
    id: "anniversary",
    name: "Anniversary",
    slug: "anniversary",
    description: "Celebrate milestones with thoughtful anniversary picks.",
  },
  {
    id: "birthday",
    name: "Birthday",
    slug: "birthday",
    description: "Make birthdays unforgettable with premium gifts.",
  },
  {
    id: "corporate",
    name: "Corporate",
    slug: "corporate",
    description: "Refined gifts for colleagues and business relations.",
  },
  {
    id: "get-well-soon",
    name: "Get Well Soon",
    slug: "get-well-soon",
    description: "Send warm wishes with comforting care packages.",
  },
  {
    id: "wedding",
    name: "Wedding",
    slug: "wedding",
    description: "Elegant gifts for the happy couple.",
  },
];

const colorPalette = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
];

export default async function CategoriesPage() {
  let categories: CategoryRecord[];
  try {
    categories = await getCategories();
    if (categories.length === 0) categories = fallbackCategories;
  } catch {
    categories = fallbackCategories;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">
          Categories
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Browse our curated gift categories to find the perfect present.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-sm shadow-black/5 backdrop-blur transition hover:shadow-md hover:-translate-y-1 dark:bg-black/20"
          >
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold ${colorPalette[i % colorPalette.length]}`}
            >
              {cat.name.charAt(0)}
            </div>
            <h2 className="mt-4 text-base font-semibold text-zinc-950 dark:text-white group-hover:text-primary transition">
              {cat.name}
            </h2>
            {cat.description ? (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
                {cat.description}
              </p>
            ) : null}
            <div className="mt-4 text-xs font-medium text-primary">
              Browse products &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
