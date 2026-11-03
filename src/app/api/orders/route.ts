import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import {
  createOrder,
  getOrderItems,
  listOrdersForUser,
} from "@/lib/orders";

const schema = z.object({
  paymentMethod: z.enum(["MOBILE_MONEY", "CARD", "CASH_ON_DELIVERY"]),
  fullName: z.string().trim().min(2),
  phone: z.string().trim().min(10),
  email: z.string().trim().email(),
  address: z.string().trim().min(5),
  city: z.string().trim().min(2),
  notes: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1),
});

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = listOrdersForUser(user.id).map((order) => ({
    ...order,
    items: getOrderItems(order.id),
  }));

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid checkout data" },
        { status: 400 }
      );
    }

    const order = createOrder({
      userId: user.id,
      ...parsed.data,
    });

    return NextResponse.json({
      order,
      items: getOrderItems(order.id),
      message:
        order.payment_method === "CASH_ON_DELIVERY"
          ? "Order placed. Pay cash when your package arrives."
          : "Payment confirmed. Thank you for shopping with KaCollection!",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not place order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
