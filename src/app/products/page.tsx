import { ProductCard } from "@/components/ProductCard";
import { listCategories, listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; category?: string }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const categories = listCategories();
  const products = listProducts({
    q: params.q,
    category: params.category,
  });

  return (
    <div className="container page-hero">
      <p className="eyebrow">Catalogue</p>
      <h1 className="page-title">Products & services</h1>
      <p className="muted">
        Search and filter authentic Rwandan goods. All prices are in Rwandan
        Francs (RWF).
      </p>

      <div className="filters">
        <form method="get">
          <input
            type="search"
            name="q"
            placeholder="Search baskets, coffee, textiles…"
            defaultValue={params.q || ""}
            style={{ maxWidth: 360 }}
          />
          <select
            name="category"
            defaultValue={params.category || ""}
            style={{ maxWidth: 260 }}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <button className="btn" type="submit">
            Filter
          </button>
        </form>
      </div>

      {products.length === 0 ? (
        <div className="panel">
          <p>No products match your search. Try another keyword or category.</p>
        </div>
      ) : (
        <div className="product-grid" style={{ marginBottom: "3rem" }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              image={product.image}
              stock={product.stock}
              available={Boolean(product.available)}
              categoryName={product.category_name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
