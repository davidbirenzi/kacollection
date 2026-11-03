import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath =
  process.env.DATABASE_URL?.replace(/^\.\//, "") || "data/kacollection.db";
const absolutePath = path.isAbsolute(dbPath)
  ? dbPath
  : path.join(process.cwd(), dbPath);

fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

const globalForDb = globalThis as unknown as {
  kacollectionDb?: Database.Database;
};

export const db =
  globalForDb.kacollectionDb ??
  new Database(absolutePath, {
    // Keep a single connection in Next.js dev (hot reload)
  });

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

if (process.env.NODE_ENV !== "production") {
  globalForDb.kacollectionDb = db;
}

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK(role IN ('CUSTOMER', 'ADMIN')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      image TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      available INTEGER NOT NULL DEFAULT 1,
      category_id TEXT NOT NULL REFERENCES categories(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL REFERENCES users(id),
      status TEXT NOT NULL DEFAULT 'PENDING'
        CHECK(status IN ('PENDING','PAID','PROCESSING','DELIVERED','CANCELLED')),
      payment_method TEXT NOT NULL
        CHECK(payment_method IN ('MOBILE_MONEY','CARD','CASH_ON_DELIVERY')),
      payment_ref TEXT,
      subtotal INTEGER NOT NULL,
      delivery_fee INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL REFERENCES products(id),
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id),
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      user_id TEXT REFERENCES users(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

initSchema();

export type Role = "CUSTOMER" | "ADMIN";
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentMethod = "MOBILE_MONEY" | "CARD" | "CASH_ON_DELIVERY";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  role: Role;
  created_at: string;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  featured: number;
  available: number;
  category_id: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_slug?: string;
};

export type OrderRow = {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_ref: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer_name?: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};

export type ReviewRow = {
  id: string;
  rating: number;
  comment: string;
  user_id: string;
  product_id: string;
  created_at: string;
  user_name?: string;
};

export function createId() {
  return crypto.randomUUID();
}
