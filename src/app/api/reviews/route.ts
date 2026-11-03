import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { createId, readStore, updateStore } from "@/lib/store";

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

    const existing = readStore().reviews.find(
      (r) => r.user_id === user.id && r.product_id === parsed.data.productId
    );

    if (existing) {
      return NextResponse.json(
        { error: "You already reviewed this product" },
        { status: 409 }
      );
    }

    const id = createId();
    const now = new Date().toISOString().replace("T", " ").slice(0, 19);

    updateStore((store) => {
      store.reviews.push({
        id,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
        user_id: user.id,
        product_id: parsed.data.productId,
        created_at: now,
      });
    });

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save review" }, { status: 500 });
  }
}
