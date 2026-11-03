import { NextResponse } from "next/server";
import { z } from "zod";
import { slugify } from "@/lib/format";
import {
  deleteProduct,
  getProductById,
  saveProduct,
} from "@/lib/products";
import { readStore } from "@/lib/store";

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

    const store = readStore();
    let slug = slugify(parsed.data.name);
    if (store.products.some((p) => p.slug === slug && p.id !== id)) {
      slug = `${slug}-${id.slice(0, 6)}`;
    }

    const now = new Date().toISOString().replace("T", " ").slice(0, 19);
    const product = saveProduct(
      {
        ...existing,
        name: parsed.data.name,
        slug,
        description: parsed.data.description,
        price: parsed.data.price,
        image: parsed.data.image,
        stock: parsed.data.stock,
        featured: parsed.data.featured ? 1 : 0,
        available: parsed.data.available === false ? 0 : 1,
        category_id: parsed.data.categoryId,
        updated_at: now,
      },
      false
    );

    return NextResponse.json({ product });
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

  deleteProduct(id);
  return NextResponse.json({ ok: true });
}
