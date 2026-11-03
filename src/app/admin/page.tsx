import Link from "next/link";
import { listAllOrders } from "@/lib/orders";
import { listProducts } from "@/lib/products";
import { formatRwf } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const products = listProducts({ availableOnly: false });
  const orders = listAllOrders();
  const revenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="container page-hero" style={{ paddingBottom: "3rem" }}>
      <p className="eyebrow">Administrator</p>
      <h1 className="page-title">Dashboard</h1>
      <div className="admin-nav">
        <Link href="/admin" className="btn btn-small">
          Overview
        </Link>
        <Link href="/admin/products" className="btn btn-secondary btn-small">
          Manage products
        </Link>
        <Link href="/admin/orders" className="btn btn-secondary btn-small">
          Manage orders
        </Link>
      </div>
      <div className="stats">
        <div className="stat-card">
          <span className="muted">Products</span>
          <strong>{products.length}</strong>
        </div>
        <div className="stat-card">
          <span className="muted">Orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="stat-card">
          <span className="muted">Revenue (excl. cancelled)</span>
          <strong>{formatRwf(revenue)}</strong>
        </div>
      </div>
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Quick actions</h2>
        <p className="muted">
          Add or edit catalogue items, then update customer order statuses from
          pending to paid, processing or delivered.
        </p>
        <div className="cta-row">
          <Link href="/admin/products" className="btn">
            Products
          </Link>
          <Link href="/admin/orders" className="btn btn-secondary">
            Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
