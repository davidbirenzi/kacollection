import bcrypt from "bcryptjs";
import { createId, db, initSchema } from "../lib/db";

initSchema();

db.exec(`
  DELETE FROM order_items;
  DELETE FROM orders;
  DELETE FROM reviews;
  DELETE FROM contact_messages;
  DELETE FROM products;
  DELETE FROM categories;
  DELETE FROM users;
`);

const adminId = createId();
const customerId = createId();

db.prepare(
  `INSERT INTO users (id, name, email, password_hash, phone, role)
   VALUES (?, ?, ?, ?, ?, ?)`
).run(
  adminId,
  "KaCollection Admin",
  "admin@kacollection.rw",
  bcrypt.hashSync("Admin123!", 10),
  "+250788000001",
  "ADMIN"
);

db.prepare(
  `INSERT INTO users (id, name, email, password_hash, phone, role)
   VALUES (?, ?, ?, ?, ?, ?)`
).run(
  customerId,
  "Uwase Keza",
  "customer@kacollection.rw",
  bcrypt.hashSync("Customer123!", 10),
  "+250788000002",
  "CUSTOMER"
);

const categories = [
  {
    name: "Baskets & Weaving",
    slug: "baskets-weaving",
    description: "Handwoven agaseke baskets and sisal crafts from Rwanda.",
  },
  {
    name: "Coffee & Tea",
    slug: "coffee-tea",
    description: "Mountain-grown Rwandan coffee and herbal teas.",
  },
  {
    name: "Textiles & Fashion",
    slug: "textiles-fashion",
    description: "Imigongo-inspired fabrics, wraps and apparel.",
  },
  {
    name: "Home Décor",
    slug: "home-decor",
    description: "Art pieces and décor that celebrate Rwandan design.",
  },
];

const categoryIds: Record<string, string> = {};
const insertCategory = db.prepare(
  `INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)`
);

for (const category of categories) {
  const id = createId();
  categoryIds[category.slug] = id;
  insertCategory.run(id, category.name, category.slug, category.description);
}

const products = [
  {
    name: "Classic Agaseke Peace Basket",
    slug: "classic-agaseke-peace-basket",
    description:
      "A handwoven peace basket made by cooperative artisans in Gitarama. Natural sisal with black and cream geometric patterns — ideal for gifts or home storage.",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
    stock: 24,
    featured: 1,
    category: "baskets-weaving",
  },
  {
    name: "Twin Heart Sisal Basket",
    slug: "twin-heart-sisal-basket",
    description:
      "Medium sisal basket featuring traditional twin-heart motifs. Lightweight, sturdy, and finished with a secure lid.",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    stock: 18,
    featured: 1,
    category: "baskets-weaving",
  },
  {
    name: "Mini Agaseke Gift Set",
    slug: "mini-agaseke-gift-set",
    description:
      "Set of three mini woven baskets perfect for jewellery, keys or desk storage. Packed in recycled kraft wrapping.",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
    stock: 40,
    featured: 0,
    category: "baskets-weaving",
  },
  {
    name: "Volcanoes Bourbon Coffee 500g",
    slug: "volcanoes-bourbon-coffee-500g",
    description:
      "Single-origin Bourbon Arabica from the volcanic slopes of Musanze. Medium roast with notes of caramel, citrus and cocoa.",
    price: 12000,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
    stock: 60,
    featured: 1,
    category: "coffee-tea",
  },
  {
    name: "Lake Kivu Honey Roast 250g",
    slug: "lake-kivu-honey-roast-250g",
    description:
      "Honey-processed beans from cooperatives around Lake Kivu. Smooth body with soft floral sweetness.",
    price: 9000,
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80",
    stock: 45,
    featured: 0,
    category: "coffee-tea",
  },
  {
    name: "Rwandan Lemongrass Tea Box",
    slug: "rwandan-lemongrass-tea-box",
    description:
      "20 biodegradable sachets of locally grown lemongrass tea. Caffeine-free and refreshing after meals.",
    price: 6500,
    image:
      "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=800&q=80",
    stock: 70,
    featured: 0,
    category: "coffee-tea",
  },
  {
    name: "Imigongo Print Kitenge Wrap",
    slug: "imigongo-print-kitenge-wrap",
    description:
      "Soft cotton wrap featuring bold imigongo-inspired geometry in black, cream and indigo. One size fits most.",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
    stock: 30,
    featured: 1,
    category: "textiles-fashion",
  },
  {
    name: "Handwoven Cotton Table Runner",
    slug: "handwoven-cotton-table-runner",
    description:
      "Two-metre table runner woven on traditional looms in Huye. Natural dyes and fringed edges.",
    price: 16000,
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    stock: 22,
    featured: 0,
    category: "textiles-fashion",
  },
  {
    name: "Ubwiza Linen Shirt",
    slug: "ubwiza-linen-shirt",
    description:
      "Breathable unisex linen shirt with subtle embroidered collar detail. Available in stone and olive tones (one style shown).",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    stock: 15,
    featured: 1,
    category: "textiles-fashion",
  },
  {
    name: "Cow Horn Serving Spoon Set",
    slug: "cow-horn-serving-spoon-set",
    description:
      "Pair of polished cow-horn serving spoons crafted in Kigali workshops. Food-safe finish, unique natural grain.",
    price: 14000,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    stock: 28,
    featured: 0,
    category: "home-decor",
  },
  {
    name: "Imigongo Wall Panel",
    slug: "imigongo-wall-panel",
    description:
      "Authentic imigongo geometric wall art on wooden board. Traditional cow-dung and natural pigment technique.",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80",
    stock: 10,
    featured: 1,
    category: "home-decor",
  },
  {
    name: "Banana Fibre Placemat Set",
    slug: "banana-fibre-placemat-set",
    description:
      "Set of four placemats woven from banana fibre. Heat-resistant and biodegradable — made near Nyungwe.",
    price: 11000,
    image:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80",
    stock: 35,
    featured: 0,
    category: "home-decor",
  },
];

const insertProduct = db.prepare(`
  INSERT INTO products (
    id, name, slug, description, price, image, stock, featured, available, category_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
`);

for (const product of products) {
  insertProduct.run(
    createId(),
    product.name,
    product.slug,
    product.description,
    product.price,
    product.image,
    product.stock,
    product.featured,
    categoryIds[product.category]
  );
}

console.log("Seed complete.");
console.log("Admin: admin@kacollection.rw / Admin123!");
console.log("Customer: customer@kacollection.rw / Customer123!");
