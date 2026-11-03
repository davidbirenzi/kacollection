import Link from "next/link";
import { AdminOrderManager } from "@/components/AdminOrderManager";
import { getOrderItems, listAllOrders } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  const orders = listAllOrders().map((order) => ({
    ...order,
    items: getOrderItems(order.id),
  }));

  return (
    <div className="container page-hero" style={{ paddingBottom: "3rem" }}>
      <p className="eyebrow">Administrator</p>
      <h1 className="page-title">Manage orders</h1>
      <div className="admin-nav">
        <Link href="/admin" className="btn btn-secondary btn-small">
          Overview
        </Link>
        <Link href="/admin/products" className="btn btn-secondary btn-small">
          Manage products
        </Link>
        <Link href="/admin/orders" className="btn btn-small">
          Manage orders
        </Link>
      </div>
      <AdminOrderManager initialOrders={orders} />
    </div>
  );
}
