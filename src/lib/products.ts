import { readStore, updateStore } from "./store";
import type { CategoryRow, ProductRow, ReviewRow } from "./types";

function withCategory(product: ProductRow, categories: CategoryRow[]): ProductRow {
  const category = categories.find((c) => c.id === product.category_id);
  return {
    ...product,
    category_name: category?.name,
    category_slug: category?.slug,
  };
}

export function listCategories() {
  return [...readStore().categories].sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategoryBySlug(slug: string) {
  return readStore().categories.find((c) => c.slug === slug);
}

type ProductFilters = {
  q?: string;
  category?: string;
  featured?: boolean;
  availableOnly?: boolean;
};

export function listProducts(filters: ProductFilters = {}) {
  const store = readStore();
  let products = store.products.map((p) => withCategory(p, store.categories));

  if (filters.availableOnly !== false) {
    products = products.filter((p) => p.available === 1);
  }
  if (filters.featured) {
    products = products.filter((p) => p.featured === 1);
  }
  if (filters.category) {
    products = products.filter((p) => p.category_slug === filters.category);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return products.sort((a, b) => {
    if (b.featured !== a.featured) return b.featured - a.featured;
    return a.name.localeCompare(b.name);
  });
}

export function getProductBySlug(slug: string) {
  const store = readStore();
  const product = store.products.find((p) => p.slug === slug);
  return product ? withCategory(product, store.categories) : undefined;
}

export function getProductById(id: string) {
  const store = readStore();
  const product = store.products.find((p) => p.id === id);
  return product ? withCategory(product, store.categories) : undefined;
}

export function getProductReviews(productId: string) {
  const store = readStore();
  return store.reviews
    .filter((r) => r.product_id === productId)
    .map((review) => {
      const user = store.users.find((u) => u.id === review.user_id);
      return { ...review, user_name: user?.name } as ReviewRow;
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function saveProduct(product: ProductRow, isNew: boolean) {
  updateStore((store) => {
    if (isNew) {
      store.products.unshift(product);
    } else {
      store.products = store.products.map((p) =>
        p.id === product.id ? product : p
      );
    }
  });
  return getProductById(product.id);
}

export function deleteProduct(id: string) {
  updateStore((store) => {
    store.products = store.products.filter((p) => p.id !== id);
    store.reviews = store.reviews.filter((r) => r.product_id !== id);
  });
}
