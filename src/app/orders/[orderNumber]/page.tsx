import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  formatRwf,
  PAYMENT_LABELS,
  STATUS_LABELS,
} from "@/lib/format";
import { getOrderByNumber, getOrderItems } from "@/lib/orders";

export const dynamic = "force-dynamic";

type Params = Promise<{ orderNumber: string }>;
type SearchParams = Promise<{ paid?: string; msg?: string }>;

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const { orderNumber } = await params;
  const query = await searchParams;
  const order = getOrderByNumber(orderNumber);
  if (!order) notFound();
  if (order.user_id !== user.id && user.role !== "ADMIN") {
    redirect("/account");
  }

  const items = getOrderItems(order.id);

  return (
    <div className="container page-hero" style={{ paddingBottom: "3rem" }}>
      <p className="eyebrow">Order confirmation</p>
      <h1 className="page-title">{order.order_number}</h1>
      {query.paid ? (
        <div className="alert" style={{ marginTop: "1rem" }}>
          {query.msg || "Your order and payment were recorded successfully."}
        </div>
      ) : null}

      <div className="split" style={{ marginTop: "1.5rem" }}>
        <div className="panel stack">
          <h2 style={{ margin: 0 }}>Items</h2>
          {items.map((item) => (
            <p
              key={item.id}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatRwf(item.price * item.quantity)}</span>
            </p>
          ))}
          <hr style={{ border: 0, borderTop: "1px solid var(--line)" }} />
          <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal</span>
            <strong>{formatRwf(order.subtotal)}</strong>
          </p>
          <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Delivery</span>
            <strong>{formatRwf(order.delivery_fee)}</strong>
          </p>
          <p style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total</span>
            <strong>{formatRwf(order.total)}</strong>
          </p>
        </div>
        <div className="panel stack">
          <h2 style={{ margin: 0 }}>Details</h2>
          <p>
            <strong>Status:</strong> {STATUS_LABELS[order.status]}
          </p>
          <p>
            <strong>Payment:</strong> {PAYMENT_LABELS[order.payment_method]}
          </p>
          {order.payment_ref ? (
            <p>
              <strong>Payment ref:</strong> {order.payment_ref}
            </p>
          ) : null}
          <p>
            <strong>Deliver to:</strong> {order.full_name}, {order.address},{" "}
            {order.city}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <Link href="/account" className="btn btn-secondary" style={{ width: "fit-content" }}>
            Back to account
          </Link>
        </div>
      </div>
    </div>
  );
}
