"use client";

import { FormEvent, useState } from "react";
import { formatRwf } from "@/lib/format";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  featured: boolean;
  available: boolean;
  categoryId: string;
  categoryName: string;
};

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  stock: "10",
  featured: false,
  available: true,
  categoryId: "",
};

export function AdminProductManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({
    ...emptyForm,
    categoryId: categories[0]?.id || "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image,
      stock: String(product.stock),
      featured: product.featured,
      available: product.available,
      categoryId: product.categoryId,
    });
    setError("");
    setMessage("");
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image: form.image,
      stock: Number(form.stock),
      featured: form.featured,
      available: form.available,
      categoryId: form.categoryId,
    };

    const res = await fetch(
      editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }

    const saved = data.product;
    const mapped: Product = {
      id: saved.id,
      name: saved.name,
      description: saved.description,
      price: saved.price,
      image: saved.image,
      stock: saved.stock,
      featured: Boolean(saved.featured),
      available: Boolean(saved.available),
      categoryId: saved.category_id,
      categoryName: saved.category_name || "",
    };

    setProducts((prev) => {
      if (editingId) {
        return prev.map((p) => (p.id === editingId ? mapped : p));
      }
      return [mapped, ...prev];
    });
    setMessage(editingId ? "Product updated." : "Product added.");
    resetForm();
  }

  async function removeProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Delete failed");
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
    setMessage("Product deleted.");
  }

  return (
    <div className="split">
      <form className="panel stack" onSubmit={onSubmit}>
        <h2 style={{ margin: 0 }}>
          {editingId ? "Edit product" : "Add product"}
        </h2>
        {error ? <div className="alert error">{error}</div> : null}
        {message ? <div className="alert">{message}</div> : null}
        <label>
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          Description
          <textarea
            required
            minLength={10}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <div className="form-grid two">
          <label>
            Price (RWF)
            <input
              type="number"
              required
              min={1}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              required
              min={0}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </label>
        </div>
        <label>
          Image URL
          <input
            type="url"
            required
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://…"
          />
        </label>
        <label>
          Category
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            style={{ width: "auto" }}
          />
          Featured on home page
        </label>
        <label style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            style={{ width: "auto" }}
          />
          Available for sale
        </label>
        <div className="cta-row">
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Saving…" : editingId ? "Update product" : "Add product"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="panel table-wrap">
        <h2 style={{ marginTop: 0 }}>Catalogue ({products.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                  <div className="muted">{product.categoryName}</div>
                </td>
                <td>{formatRwf(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <div className="cta-row">
                    <button
                      type="button"
                      className="btn btn-secondary btn-small"
                      onClick={() => startEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-small"
                      onClick={() => removeProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
