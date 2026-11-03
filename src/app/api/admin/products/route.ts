import { NextResponse } from "next/server";
import { z } from "zod";
import { slugify } from "@/lib/format";
import { getProductById, listProducts, saveProduct } from "@/lib/products";
import { createId, readStore } from "@/lib/store";

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

    const store = readStore();
    const category = store.categories.find((c) => c.id === parsed.data.categoryId);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }

    const id = createId();
    let slug = slugify(parsed.data.name);
    if (store.products.some((p) => p.slug === slug)) {
      slug = `${slug}-${id.slice(0, 6)}`;
    }

    const now = new Date().toISOString().replace("T", " ").slice(0, 19);
    const product = saveProduct(
      {
        id,
        name: parsed.data.name,
        slug,
        description: parsed.data.description,
        price: parsed.data.price,
        image: parsed.data.image,
        stock: parsed.data.stock,
        featured: parsed.data.featured ? 1 : 0,
        available: parsed.data.available === false ? 0 : 1,
        category_id: parsed.data.categoryId,
        created_at: now,
        updated_at: now,
      },
      true
    );

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create product" }, { status: 500 });
  }
}
