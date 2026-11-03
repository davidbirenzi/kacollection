"use client";

import { useState } from "react";
import {
  formatRwf,
  PAYMENT_LABELS,
  STATUS_LABELS,
} from "@/lib/format";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  order_number: string;
  status: keyof typeof STATUS_LABELS;
  payment_method: keyof typeof PAYMENT_LABELS;
  total: number;
  full_name: string;
  city: string;
  customer_name?: string;
  created_at: string;
  items: OrderItem[];
};

const statuses = Object.keys(STATUS_LABELS) as Array<keyof typeof STATUS_LABELS>;

export function AdminOrderManager({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [error, setError] = useState("");

  async function updateStatus(id: string, status: string) {
    setError("");
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Update failed");
      return;
    }
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, status: data.order.status, items: data.items }
          : order
      )
    );
  }

  return (
    <div className="stack">
      {error ? <div className="alert error">{error}</div> : null}
      {orders.length === 0 ? (
        <div className="panel">No orders yet.</div>
      ) : (
        orders.map((order) => (
          <article key={order.id} className="panel stack">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong>{order.order_number}</strong>
                <p className="muted" style={{ margin: "0.25rem 0 0" }}>
                  {order.customer_name || order.full_name} · {order.city} ·{" "}
                  {PAYMENT_LABELS[order.payment_method]}
                </p>
              </div>
              <strong>{formatRwf(order.total)}</strong>
            </div>
            <p className="muted" style={{ margin: 0 }}>
              {order.items
                .map((item) => `${item.name} × ${item.quantity}`)
                .join(", ")}
            </p>
            <label style={{ maxWidth: 280 }}>
              Status
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
          </article>
        ))
      )}
    </div>
  );
}
