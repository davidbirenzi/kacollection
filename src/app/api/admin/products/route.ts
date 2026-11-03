import { NextResponse } from "next/server";
import { z } from "zod";
import { createId, db } from "@/lib/db";
import { slugify } from "@/lib/format";
import { getProductById, listProducts } from "@/lib/products";

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

export async function GET() {
  const products = listProducts({ availableOnly: false });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid product" },
        { status: 400 }
      );
    }

    const category = db
      .prepare("SELECT id FROM categories WHERE id = ?")
      .get(parsed.data.categoryId);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }

    const id = createId();
    let slug = slugify(parsed.data.name);
    const existing = db
      .prepare("SELECT id FROM products WHERE slug = ?")
      .get(slug);
    if (existing) slug = `${slug}-${id.slice(0, 6)}`;

    db.prepare(
      `INSERT INTO products (
        id, name, slug, description, price, image, stock, featured, available, category_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      parsed.data.name,
      slug,
      parsed.data.description,
      parsed.data.price,
      parsed.data.image,
      parsed.data.stock,
      parsed.data.featured ? 1 : 0,
      parsed.data.available === false ? 0 : 1,
      parsed.data.categoryId
    );

    return NextResponse.json({ product: getProductById(id) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create product" }, { status: 500 });
  }
}
