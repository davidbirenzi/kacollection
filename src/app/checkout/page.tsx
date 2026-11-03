"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { DELIVERY_FEE, formatRwf, PAYMENT_LABELS } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login?next=/checkout");
          return;
        }
        setUserEmail(data.user.email || "");
        setUserName(data.user.name || "");
        setUserPhone(data.user.phone || "");
      });
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentMethod: form.get("paymentMethod"),
        fullName: form.get("fullName"),
        phone: form.get("phone"),
        email: form.get("email"),
        address: form.get("address"),
        city: form.get("city"),
        notes: form.get("notes") || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Checkout failed");
      return;
    }

    clearCart();
    router.push(
      `/orders/${data.order.order_number}?paid=1&msg=${encodeURIComponent(data.message)}`
    );
  }

  if (items.length === 0) {
    return (
      <div className="container page-hero">
        <div className="panel stack">
          <h1 className="page-title">Checkout</h1>
          <p>Your cart is empty.</p>
          <Link href="/products" className="btn" style={{ width: "fit-content" }}>
            Browse catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-hero" style={{ paddingBottom: "3rem" }}>
      <p className="eyebrow">Almost there</p>
      <h1 className="page-title">Checkout & payment</h1>
      <p className="muted">
        Simulated payment only — no real money is charged. Choose Mobile Money,
        card or cash on delivery.
      </p>

      <div className="split" style={{ marginTop: "1.5rem" }}>
        <form className="panel stack" onSubmit={onSubmit}>
          {error ? <div className="alert error">{error}</div> : null}
          <h2 style={{ margin: 0 }}>Delivery details</h2>
          <div className="form-grid two">
            <label>
              Full name
              <input name="fullName" required defaultValue={userName} />
            </label>
            <label>
              Phone
              <input
                name="phone"
                required
                placeholder="+2507…"
                defaultValue={userPhone}
              />
            </label>
          </div>
          <label>
            Email
            <input
              type="email"
              name="email"
              required
              defaultValue={userEmail}
            />
          </label>
          <label>
            Delivery address
            <input name="address" required placeholder="Street, house / office" />
          </label>
          <label>
            City / District
            <input name="city" required defaultValue="Kigali" />
          </label>
          <label>
            Notes (optional)
            <textarea name="notes" placeholder="Gate code, preferred time…" />
          </label>

          <h2 style={{ margin: "0.5rem 0 0" }}>Payment method</h2>
          {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
            <label
              key={value}
              style={{
                display: "flex",
                gap: "0.75rem",
                alignItems: "center",
                fontWeight: 500,
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={value}
                required
                defaultChecked={value === "MOBILE_MONEY"}
                style={{ width: "auto" }}
              />
              {label}
            </label>
          ))}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Processing…" : "Place order & confirm payment"}
          </button>
        </form>

        <aside className="panel stack">
          <h2 style={{ margin: 0 }}>Order summary</h2>
          {items.map((item) => (
            <p
              key={item.productId}
              style={{ display: "flex", justifyContent: "space-between", margin: 0 }}
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatRwf(item.price * item.quantity)}</span>
            </p>
          ))}
          <hr style={{ border: 0, borderTop: "1px solid var(--line)", width: "100%" }} />
          <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal</span>
            <strong>{formatRwf(subtotal)}</strong>
          </p>
          <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Delivery</span>
            <strong>{formatRwf(DELIVERY_FEE)}</strong>
          </p>
          <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total</span>
            <strong>{formatRwf(subtotal + DELIVERY_FEE)}</strong>
          </p>
        </aside>
      </div>
    </div>
  );
}
