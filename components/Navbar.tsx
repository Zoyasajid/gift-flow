"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const isActive = useMemo(() => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }, [href, pathname]);

  return (
    <Link
      href={href}
      className={[
        "rounded-xl px-3 py-2 text-sm font-medium transition",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-zinc-700 hover:bg-black/5 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = (await res.json()) as { user?: { role?: string } | null };
        if (!cancelled) {
          setIsAdmin(data.user?.role === "ADMIN");
        }
      } catch {
        if (!cancelled) setIsAdmin(false);
      }
    }

    void loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const links = [
    { href: "/products", label: "Products" },
    { href: "/cart", label: "Cart" },
    { href: "/checkout", label: "Checkout" },
  ];
  if (isAdmin) {
    links.push({ href: "/admin", label: "Admin" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur dark:bg-black/40">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-black/5 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-black/10 dark:bg-white/5 dark:text-white"
          >
            <span className="text-primary">GiftFlow</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {links.map((l) => (
            <NavLink
              key={l.href}
              href={l.href}
              label={l.label}
              pathname={pathname ?? "/"}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isAdmin ? (
            <Link
              href="/admin/login"
              className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white/80 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-white"
            >
              Admin login
            </Link>
          ) : null}
          <Link
            href="/checkout"
            className="inline-flex h-10 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white/70 text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-black/30 dark:text-white md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-sm font-bold">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-black/5 bg-white/80 backdrop-blur dark:bg-black/50 md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <NavLink
                key={l.href}
                href={l.href}
                label={l.label}
                pathname={pathname ?? "/"}
              />
            ))}
            {!isAdmin ? (
              <Link
                href="/admin/login"
                className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-black/5 hover:text-zinc-950 dark:text-zinc-200 dark:hover:bg-white/5 dark:hover:text-white"
              >
                Admin login
              </Link>
            ) : null}
            <Link
              href="/checkout"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition hover:bg-indigo-600"
              onClick={() => setOpen(false)}
            >
              Get started
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

