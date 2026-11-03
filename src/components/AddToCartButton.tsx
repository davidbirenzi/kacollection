"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  product: {
    productId: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
  disabled?: boolean;
};

export function AddToCartButton({ product, disabled }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="stack">
      <div className="qty-controls">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span>{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        className="btn"
        disabled={disabled}
        onClick={() => {
          addItem(product, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
      >
        {added ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}
