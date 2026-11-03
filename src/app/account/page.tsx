import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { formatRwf, STATUS_LABELS } from "@/lib/format";
import { getOrderItems, listOrdersForUser } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/account");

  const orders = listOrdersForUser(user.id);

  return (
    <div className="container page-hero" style={{ paddingBottom: "3rem" }}>
      <p className="eyebrow">My account</p>
      <h1 className="page-title">Hello, {user.name}</h1>
      <div className="split" style={{ marginTop: "1.5rem" }}>
        <div className="panel stack">
          <h2 style={{ margin: 0 }}>Profile</h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          {user.phone ? (
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
          ) : null}
          {user.role === "ADMIN" ? (
            <Link href="/admin" className="btn" style={{ width: "fit-content" }}>
              Open admin dashboard
            </Link>
          ) : null}
        </div>
        <div className="stack">
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)" }}>
            Recent orders
          </h2>
          {orders.length === 0 ? (
            <div className="panel">
              <p>No orders yet.</p>
              <Link href="/products">Start shopping</Link>
            </div>
          ) : (
            orders.map((order) => {
              const items = getOrderItems(order.id);
              return (
                <article key={order.id} className="order-card panel stack">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong>{order.order_number}</strong>
                    <span>{STATUS_LABELS[order.status]}</span>
                  </div>
                  <p className="muted" style={{ margin: 0 }}>
                    {items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
                  </p>
                  <p style={{ margin: 0 }}>
                    Total {formatRwf(order.total)} ·{" "}
                    <Link href={`/orders/${order.order_number}`}>View</Link>
                  </p>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
