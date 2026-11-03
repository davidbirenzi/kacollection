import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { createId, db } from "@/lib/db";
import { getProductById } from "@/lib/products";

const schema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(5).max(500),
});

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Please log in to review" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid review" },
        { status: 400 }
      );
    }

    if (!getProductById(parsed.data.productId)) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existing = db
      .prepare(
        "SELECT id FROM reviews WHERE user_id = ? AND product_id = ?"
      )
      .get(user.id, parsed.data.productId);

    if (existing) {
      return NextResponse.json(
        { error: "You already reviewed this product" },
        { status: 409 }
      );
    }

    const id = createId();
    db.prepare(
      `INSERT INTO reviews (id, rating, comment, user_id, product_id)
       VALUES (?, ?, ?, ?, ?)`
    ).run(
      id,
      parsed.data.rating,
      parsed.data.comment,
      user.id,
      parsed.data.productId
    );

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save review" }, { status: 500 });
  }
}
