"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatRwf } from "@/lib/format";

type ProductCardProps = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
  categoryName?: string;
  available: boolean;
};

export function ProductCard(props: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <article className="product-card">
      <Link href={`/products/${props.slug}`} className="product-media">
        <Image
          src={props.image}
          alt={props.name}
          width={640}
          height={480}
          className="product-image"
        />
        {!props.available || props.stock < 1 ? (
          <span className="badge">Out of stock</span>
        ) : null}
      </Link>
      <div className="product-body">
        {props.categoryName ? (
          <p className="eyebrow">{props.categoryName}</p>
        ) : null}
        <h3>
          <Link href={`/products/${props.slug}`}>{props.name}</Link>
        </h3>
        <p className="price">{formatRwf(props.price)}</p>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!props.available || props.stock < 1}
          onClick={() =>
            addItem({
              productId: props.id,
              name: props.name,
              price: props.price,
              image: props.image,
              stock: props.stock,
            })
          }
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
