import { NextResponse } from "next/server";
import { getOrderItems, listAllOrders } from "@/lib/orders";

export async function GET() {
  const orders = listAllOrders().map((order) => ({
    ...order,
    items: getOrderItems(order.id),
  }));
  return NextResponse.json({ orders });
}
