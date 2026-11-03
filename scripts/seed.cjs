const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

const storePath = path.join(process.cwd(), "data", "store.json");
fs.mkdirSync(path.dirname(storePath), { recursive: true });

const now = new Date().toISOString().replace("T", " ").slice(0, 19);
const adminId = randomUUID();
const customerId = randomUUID();

const categories = [
  {
    id: randomUUID(),
    name: "Baskets & Weaving",
    slug: "baskets-weaving",
    description: "Handwoven agaseke baskets and sisal crafts from Rwanda.",
  },
  {
    id: randomUUID(),
    name: "Coffee & Tea",
    slug: "coffee-tea",
    description: "Mountain-grown Rwandan coffee and herbal teas.",
  },
  {
    id: randomUUID(),
    name: "Textiles & Fashion",
    slug: "textiles-fashion",
    description: "Imigongo-inspired fabrics, wraps and apparel.",
  },
  {
    id: randomUUID(),
    name: "Home Décor",
    slug: "home-decor",
    description: "Art pieces and décor that celebrate Rwandan design.",
  },
];

const categoryIds = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

const productDefs = [
  ["Classic Agaseke Peace Basket", "classic-agaseke-peace-basket", "A handwoven peace basket made by cooperative artisans in Gitarama. Natural sisal with black and cream geometric patterns — ideal for gifts or home storage.", 35000, "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80", 24, 1, "baskets-weaving"],
  ["Twin Heart Sisal Basket", "twin-heart-sisal-basket", "Medium sisal basket featuring traditional twin-heart motifs. Lightweight, sturdy, and finished with a secure lid.", 28000, "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80", 18, 1, "baskets-weaving"],
  ["Mini Agaseke Gift Set", "mini-agaseke-gift-set", "Set of three mini woven baskets perfect for jewellery, keys or desk storage. Packed in recycled kraft wrapping.", 18000, "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80", 40, 0, "baskets-weaving"],
  ["Volcanoes Bourbon Coffee 500g", "volcanoes-bourbon-coffee-500g", "Single-origin Bourbon Arabica from the volcanic slopes of Musanze. Medium roast with notes of caramel, citrus and cocoa.", 12000, "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80", 60, 1, "coffee-tea"],
  ["Lake Kivu Honey Roast 250g", "lake-kivu-honey-roast-250g", "Honey-processed beans from cooperatives around Lake Kivu. Smooth body with soft floral sweetness.", 9000, "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80", 45, 0, "coffee-tea"],
  ["Rwandan Lemongrass Tea Box", "rwandan-lemongrass-tea-box", "20 biodegradable sachets of locally grown lemongrass tea. Caffeine-free and refreshing after meals.", 6500, "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=800&q=80", 70, 0, "coffee-tea"],
  ["Imigongo Print Kitenge Wrap", "imigongo-print-kitenge-wrap", "Soft cotton wrap featuring bold imigongo-inspired geometry in black, cream and indigo. One size fits most.", 22000, "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80", 30, 1, "textiles-fashion"],
  ["Handwoven Cotton Table Runner", "handwoven-cotton-table-runner", "Two-metre table runner woven on traditional looms in Huye. Natural dyes and fringed edges.", 16000, "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80", 22, 0, "textiles-fashion"],
  ["Ubwiza Linen Shirt", "ubwiza-linen-shirt", "Breathable unisex linen shirt with subtle embroidered collar detail. Available in stone and olive tones (one style shown).", 32000, "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80", 15, 1, "textiles-fashion"],
  ["Cow Horn Serving Spoon Set", "cow-horn-serving-spoon-set", "Pair of polished cow-horn serving spoons crafted in Kigali workshops. Food-safe finish, unique natural grain.", 14000, "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80", 28, 0, "home-decor"],
  ["Imigongo Wall Panel", "imigongo-wall-panel", "Authentic imigongo geometric wall art on wooden board. Traditional cow-dung and natural pigment technique.", 45000, "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80", 10, 1, "home-decor"],
  ["Banana Fibre Placemat Set", "banana-fibre-placemat-set", "Set of four placemats woven from banana fibre. Heat-resistant and biodegradable — made near Nyungwe.", 11000, "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80", 35, 0, "home-decor"],
];

const products = productDefs.map(([name, slug, description, price, image, stock, featured, category]) => ({
  id: randomUUID(),
  name,
  slug,
  description,
  price,
  image,
  stock,
  featured,
  available: 1,
  category_id: categoryIds[category],
  created_at: now,
  updated_at: now,
}));

const store = {
  users: [
    {
      id: adminId,
      name: "KaCollection Admin",
      email: "admin@kacollection.rw",
      password_hash: bcrypt.hashSync("Admin123!", 10),
      phone: "+250788000001",
      role: "ADMIN",
      created_at: now,
    },
    {
      id: customerId,
      name: "Uwase Keza",
      email: "customer@kacollection.rw",
      password_hash: bcrypt.hashSync("Customer123!", 10),
      phone: "+250788000002",
      role: "CUSTOMER",
      created_at: now,
    },
  ],
  categories,
  products,
  orders: [],
  orderItems: [],
  reviews: [],
  messages: [],
};

fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
console.log("Seed complete ->", storePath);
console.log("Admin: admin@kacollection.rw / Admin123!");
console.log("Customer: customer@kacollection.rw / Customer123!");
