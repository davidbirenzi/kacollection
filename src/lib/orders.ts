import {
  createId,
  db,
  type OrderItemRow,
  type OrderRow,
  type OrderStatus,
  type PaymentMethod,
} from "./db";
import { DELIVERY_FEE } from "./format";

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
  if (!input.items.length) {
    throw new Error("Cart is empty");
  }

  const productStmt = db.prepare(
    "SELECT * FROM products WHERE id = ? AND available = 1"
  );

  const lines: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
  }[] = [];

  for (const item of input.items) {
    const product = productStmt.get(item.productId) as
      | {
          id: string;
          name: string;
          price: number;
          stock: number;
        }
      | undefined;
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
      stock: product.stock,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const deliveryFee =
    input.paymentMethod === "CASH_ON_DELIVERY" ? DELIVERY_FEE : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const orderId = createId();
  const orderNumber = generateOrderNumber();
  const paymentRef =
    input.paymentMethod === "CASH_ON_DELIVERY"
      ? null
      : `PAY-${Date.now().toString(36).toUpperCase()}`;
  const status: OrderStatus =
    input.paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PAID";

  const insertOrder = db.prepare(`
    INSERT INTO orders (
      id, order_number, user_id, status, payment_method, payment_ref,
      subtotal, delivery_fee, total, full_name, phone, email, address, city, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertItem = db.prepare(`
    INSERT INTO order_items (id, order_id, product_id, name, price, quantity)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const updateStock = db.prepare(`
    UPDATE products SET stock = stock - ?, updated_at = datetime('now')
    WHERE id = ?
  `);

  const tx = db.transaction(() => {
    insertOrder.run(
      orderId,
      orderNumber,
      input.userId,
      status,
      input.paymentMethod,
      paymentRef,
      subtotal,
      deliveryFee,
      total,
      input.fullName,
      input.phone,
      input.email,
      input.address,
      input.city,
      input.notes || null
    );

    for (const line of lines) {
      insertItem.run(
        createId(),
        orderId,
        line.productId,
        line.name,
        line.price,
        line.quantity
      );
      updateStock.run(line.quantity, line.productId);
    }
  });

  tx();

  return getOrderById(orderId)!;
}

export function getOrderById(id: string) {
  return db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as
    | OrderRow
    | undefined;
}

export function getOrderByNumber(orderNumber: string) {
  return db
    .prepare("SELECT * FROM orders WHERE order_number = ?")
    .get(orderNumber) as OrderRow | undefined;
}

export function getOrderItems(orderId: string) {
  return db
    .prepare("SELECT * FROM order_items WHERE order_id = ?")
    .all(orderId) as OrderItemRow[];
}

export function listOrdersForUser(userId: string) {
  return db
    .prepare(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC"
    )
    .all(userId) as OrderRow[];
}

export function listAllOrders() {
  return db
    .prepare(
      `SELECT o.*, u.name AS customer_name
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    )
    .all() as OrderRow[];
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  db.prepare(
    `UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(status, orderId);
  return getOrderById(orderId);
}
