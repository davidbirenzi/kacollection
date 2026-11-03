import { db, type CategoryRow, type ProductRow, type ReviewRow } from "./db";

function isBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

export function listCategories() {
  if (isBuildPhase()) return [];
  return db
    .prepare("SELECT * FROM categories ORDER BY name ASC")
    .all() as CategoryRow[];
}

export function getCategoryBySlug(slug: string) {
  if (isBuildPhase()) return undefined;
  return db.prepare("SELECT * FROM categories WHERE slug = ?").get(slug) as
    | CategoryRow
    | undefined;
}

type ProductFilters = {
  q?: string;
  category?: string;
  featured?: boolean;
  availableOnly?: boolean;
};

export function listProducts(filters: ProductFilters = {}) {
  if (isBuildPhase()) return [];
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  if (filters.availableOnly !== false) {
    clauses.push("p.available = 1");
  }
  if (filters.featured) {
    clauses.push("p.featured = 1");
  }
  if (filters.category) {
    clauses.push("c.slug = ?");
    params.push(filters.category);
  }
  if (filters.q) {
    clauses.push("(p.name LIKE ? OR p.description LIKE ?)");
    const like = `%${filters.q}%`;
    params.push(like, like);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db
    .prepare(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ${where}
       ORDER BY p.featured DESC, p.name ASC`
    )
    .all(...params) as ProductRow[];
}

export function getProductBySlug(slug: string) {
  if (isBuildPhase()) return undefined;
  return db
    .prepare(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.slug = ?`
    )
    .get(slug) as ProductRow | undefined;
}

export function getProductById(id: string) {
  if (isBuildPhase()) return undefined;
  return db
    .prepare(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.id = ?`
    )
    .get(id) as ProductRow | undefined;
}

export function getProductReviews(productId: string) {
  if (isBuildPhase()) return [];
  return db
    .prepare(
      `SELECT r.*, u.name AS user_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`
    )
    .all(productId) as ReviewRow[];
}
