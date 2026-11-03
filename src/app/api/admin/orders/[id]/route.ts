import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getOrderById,
  getOrderItems,
  updateOrderStatus,
} from "@/lib/orders";

const schema = z.object({
  status: z.enum(["PENDING", "PAID", "PROCESSING", "DELIVERED", "CANCELLED"]),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const existing = getOrderById(id);
  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = updateOrderStatus(id, parsed.data.status)!;
  return NextResponse.json({
    order,
    items: getOrderItems(order.id),
  });
}
