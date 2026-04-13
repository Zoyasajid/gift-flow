"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        setError(data.message ?? "Login failed.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-black/5 bg-white/80 p-7 shadow-sm shadow-black/5 backdrop-blur">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Only authorized admins can access dashboard routes.
          </p>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              placeholder="Admin name"
              required
            />
          </label>
          <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              placeholder="admin@giftflow.com"
              required
            />
          </label>
          <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
              required
            />
          </label>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition hover:bg-indigo-600 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

