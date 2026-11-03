import Link from "next/link";
import { AdminProductManager } from "@/components/AdminProductManager";
import { listCategories, listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  const products = listProducts({ availableOnly: false });
  const categories = listCategories();

  return (
    <div className="container page-hero" style={{ paddingBottom: "3rem" }}>
      <p className="eyebrow">Administrator</p>
      <h1 className="page-title">Manage products</h1>
      <div className="admin-nav">
        <Link href="/admin" className="btn btn-secondary btn-small">
          Overview
        </Link>
        <Link href="/admin/products" className="btn btn-small">
          Manage products
        </Link>
        <Link href="/admin/orders" className="btn btn-secondary btn-small">
          Manage orders
        </Link>
      </div>
      <AdminProductManager
        initialProducts={products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image,
          stock: p.stock,
          featured: Boolean(p.featured),
          available: Boolean(p.available),
          categoryId: p.category_id,
          categoryName: p.category_name || "",
        }))}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
        }))}
      />
    </div>
  );
}
