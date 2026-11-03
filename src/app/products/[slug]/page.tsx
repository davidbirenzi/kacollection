import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ReviewForm } from "@/components/ReviewForm";
import { formatRwf } from "@/lib/format";
import { getProductBySlug, getProductReviews } from "@/lib/products";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const reviews = getProductReviews(product.id);
  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return (
    <div className="container page-hero" style={{ paddingBottom: "3rem" }}>
      <p className="eyebrow">
        <Link href="/products">Catalogue</Link> / {product.category_name}
      </p>
      <div className="split" style={{ marginTop: "1.5rem" }}>
        <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
          <Image
            src={product.image}
            alt={product.name}
            width={1000}
            height={750}
            className="product-image"
            style={{ minHeight: 360 }}
          />
        </div>
        <div className="stack">
          <div className="panel stack">
            <h1 className="page-title" style={{ fontSize: "2.2rem" }}>
              {product.name}
            </h1>
            <p className="price" style={{ fontSize: "1.4rem" }}>
              {formatRwf(product.price)}
            </p>
            <p>{product.description}</p>
            <p className="muted">
              Availability:{" "}
              {product.available && product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
              {avg ? ` · ${avg.toFixed(1)}/5 from ${reviews.length} reviews` : ""}
            </p>
            <AddToCartButton
              product={{
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
              }}
              disabled={!product.available || product.stock < 1}
            />
          </div>
          <div className="panel">
            <h2 style={{ marginTop: 0 }}>Customer reviews</h2>
            {reviews.length === 0 ? (
              <p className="muted">No reviews yet. Be the first.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review">
                  <strong>
                    {review.user_name} · {review.rating}/5
                  </strong>
                  <p>{review.comment}</p>
                </div>
              ))
            )}
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
