"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { DELIVERY_FEE, formatRwf } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <div className="container page-hero" style={{ paddingBottom: "3rem" }}>
      <p className="eyebrow">Your selection</p>
      <h1 className="page-title">Shopping cart</h1>

      {items.length === 0 ? (
        <div className="panel stack" style={{ marginTop: "1.5rem" }}>
          <p>Your cart is empty.</p>
          <Link href="/products" className="btn" style={{ width: "fit-content" }}>
            Browse catalogue
          </Link>
        </div>
      ) : (
        <div className="split" style={{ marginTop: "1.5rem" }}>
          <div className="stack">
            {items.map((item) => (
              <div key={item.productId} className="cart-line">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                />
                <div>
                  <h3 style={{ margin: "0 0 0.35rem", fontFamily: "var(--font-display)" }}>
                    {item.name}
                  </h3>
                  <p className="muted" style={{ margin: 0 }}>
                    {formatRwf(item.price)} each
                  </p>
                  <div className="qty-controls" style={{ marginTop: "0.75rem" }}>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="link-btn"
                      style={{ marginLeft: "0.75rem", color: "var(--danger)" }}
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <strong>{formatRwf(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
          <aside className="panel stack">
            <h2 style={{ margin: 0 }}>Order summary</h2>
            <p style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <strong>{formatRwf(subtotal)}</strong>
            </p>
            <p style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Delivery (estimate)</span>
              <strong>{formatRwf(DELIVERY_FEE)}</strong>
            </p>
            <p
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.15rem",
              }}
            >
              <span>Total</span>
              <strong>{formatRwf(subtotal + DELIVERY_FEE)}</strong>
            </p>
            <Link href="/checkout" className="btn">
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
