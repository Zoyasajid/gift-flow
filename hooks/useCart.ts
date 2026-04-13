"use client";

// Next step: connect cart state to `localStorage`.
export type CartItem = {
  productId: string;
  quantity: number;
};

export function useCart() {
  return {
    items: [] as CartItem[],
    cartCount: 0,
    addToCart: (_productId: string, _qty = 1) => {
      void _productId;
      void _qty;
    },
    removeFromCart: (_productId: string) => {
      void _productId;
    },
    updateQuantity: (_productId: string, _qty: number) => {
      void _productId;
      void _qty;
    },
    clearCart: () => {},
  };
}

