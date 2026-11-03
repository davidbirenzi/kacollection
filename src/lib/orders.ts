import { createId, readStore, updateStore } from "./store";
import { DELIVERY_FEE } from "./format";
import type {
  OrderItemRow,
  OrderRow,
  OrderStatus,
  PaymentMethod,
} from "./types";

export function generateOrderNumber() {
  const stamp = Date.now().toString().slice(-8);
  const rand = Math.floor(Math.random() * 900 + 100);
  return `KAC-${stamp}-${rand}`;
}

type CheckoutInput = {
  userId: string;
  paymentMethod: PaymentMethod;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
  items: { productId: string; quantity: number }[];
};

export function createOrder(input: CheckoutInput) {
  if (!input.items.length) throw new Error("Cart is empty");

  const store = readStore();
  const lines: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[] = [];

  for (const item of input.items) {
    const product = store.products.find(
      (p) => p.id === item.productId && p.available === 1
    );
    if (!product) throw new Error("One or more products are unavailable");
    if (item.quantity < 1) throw new Error("Invalid quantity");
    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}`);
    }
    lines.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const deliveryFee = DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  const orderId = createId();
  const orderNumber = generateOrderNumber();
  const paymentRef =
    input.paymentMethod === "CASH_ON_DELIVERY"
      ? null
      : `PAY-${Date.now().toString(36).toUpperCase()}`;
  const status: OrderStatus =
    input.paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PAID";

  const order: OrderRow = {
    id: orderId,
    order_number: orderNumber,
    user_id: input.userId,
    status,
    payment_method: input.paymentMethod,
    payment_ref: paymentRef,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    full_name: input.fullName,
    phone: input.phone,
    email: input.email,
    address: input.address,
    city: input.city,
    notes: input.notes || null,
    created_at: now,
    updated_at: now,
  };

  const orderItems: OrderItemRow[] = lines.map((line) => ({
    id: createId(),
    order_id: orderId,
    product_id: line.productId,
    name: line.name,
    price: line.price,
    quantity: line.quantity,
  }));

  updateStore((next) => {
    next.orders.unshift(order);
    next.orderItems.push(...orderItems);
    for (const line of lines) {
      next.products = next.products.map((p) =>
        p.id === line.productId
          ? { ...p, stock: p.stock - line.quantity, updated_at: now }
          : p
      );
    }
  });

  return getOrderById(orderId)!;
}

export function getOrderById(id: string) {
  return readStore().orders.find((o) => o.id === id);
}

export function getOrderByNumber(orderNumber: string) {
  return readStore().orders.find((o) => o.order_number === orderNumber);
}

export function getOrderItems(orderId: string) {
  return readStore().orderItems.filter((i) => i.order_id === orderId);
}

export function listOrdersForUser(userId: string) {
  return readStore()
    .orders.filter((o) => o.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function listAllOrders() {
  const store = readStore();
  return store.orders
    .map((order) => {
      const customer = store.users.find((u) => u.id === order.user_id);
      return { ...order, customer_name: customer?.name };
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  updateStore((store) => {
    store.orders = store.orders.map((order) =>
      order.id === orderId ? { ...order, status, updated_at: now } : order
    );
  });
  return getOrderById(orderId);
}
