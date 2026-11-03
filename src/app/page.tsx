import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { listCategories, listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featured = listProducts({ featured: true }).slice(0, 4);
  const categories = listCategories();

  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <Image
            src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1800&q=80"
            alt="Handwoven Rwandan baskets"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-overlay" />
        </div>
        <div className="container hero-content">
          <p className="eyebrow">Kigali · Craft · Community</p>
          <h1>KaCollection</h1>
          <p>
            Handwoven baskets, mountain coffee and textiles from Rwandan
            cooperatives — curated and delivered across Kigali and beyond.
          </p>
          <div className="cta-row">
            <Link href="/products" className="btn">
              Browse catalogue
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Visit our atelier
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Shop by craft</p>
              <h2>Categories</h2>
            </div>
          </div>
          <div className="product-grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="panel"
              >
                <p className="eyebrow">Collection</p>
                <h3 style={{ fontFamily: "var(--font-display)", margin: "0.4rem 0" }}>
                  {category.name}
                </h3>
                <p className="muted">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Featured</p>
              <h2>Pieces our customers love</h2>
            </div>
            <Link href="/products" className="btn btn-secondary">
              View all
            </Link>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
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
        </div>
      </section>
    </>
  );
}
