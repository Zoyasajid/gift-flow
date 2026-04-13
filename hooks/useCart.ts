"use client";

import { useCallback, useSyncExternalStore } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const CART_KEY = "giftflow_cart";

// ── Tiny external store so every component shares the same cart state ──

let listeners: Array<() => void> = [];
let cachedSnapshot: CartItem[] = [];

const EMPTY: CartItem[] = [];

function emitChange() {
  cachedSnapshot = readCartFromStorage();
  for (const l of listeners) l();
}
function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  emitChange();
}

function getSnapshot(): CartItem[] {
  return cachedSnapshot;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

// Hydrate the cached snapshot on first client load
if (typeof window !== "undefined" && cachedSnapshot === EMPTY) {
  cachedSnapshot = readCartFromStorage();
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const addToCart = useCallback(
    (
      product: {
        productId: string;
        name: string;
        price: number;
        image: string;
      },
      qty = 1,
    ) => {
      const current = readCartFromStorage();
      const existing = current.find((i) => i.productId === product.productId);
      if (existing) {
        existing.quantity += qty;
      } else {
        current.push({ ...product, quantity: qty });
      }
      writeCart(current);
    },
    [],
  );

  const removeFromCart = useCallback((productId: string) => {
    const current = readCartFromStorage().filter(
      (i) => i.productId !== productId,
    );
    writeCart(current);
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    const current = readCartFromStorage();
    const item = current.find((i) => i.productId === productId);
    if (item) {
      item.quantity = Math.max(1, qty);
    }
    writeCart(current);
  }, []);

  const clearCart = useCallback(() => {
    writeCart([]);
  }, []);

  return {
    items,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
