import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { slugify } from "@/lib/format";
import { getProductById } from "@/lib/products";

const schema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  price: z.number().int().positive(),
  image: z.string().url(),
  stock: z.number().int().min(0),
  featured: z.boolean().optional(),
  available: z.boolean().optional(),
  categoryId: z.string().min(1),
});

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const existing = getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid product" },
        { status: 400 }
      );
    }

    let slug = slugify(parsed.data.name);
    const clash = db
      .prepare("SELECT id FROM products WHERE slug = ? AND id != ?")
      .get(slug, id);
    if (clash) slug = `${slug}-${id.slice(0, 6)}`;

    db.prepare(
      `UPDATE products SET
        name = ?, slug = ?, description = ?, price = ?, image = ?,
        stock = ?, featured = ?, available = ?, category_id = ?,
        updated_at = datetime('now')
       WHERE id = ?`
    ).run(
      parsed.data.name,
      slug,
      parsed.data.description,
      parsed.data.price,
      parsed.data.image,
      parsed.data.stock,
      parsed.data.featured ? 1 : 0,
      parsed.data.available === false ? 0 : 1,
      parsed.data.categoryId,
      id
    );

    return NextResponse.json({ product: getProductById(id) });
  } catch {
    return NextResponse.json({ error: "Could not update product" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const existing = getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
