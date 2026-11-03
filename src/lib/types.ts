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

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  user_id: string | null;
  created_at: string;
};
