"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        rating: Number(form.get("rating")),
        comment: form.get("comment"),
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Could not submit review");
      return;
    }

    setSuccess("Review published. Thank you!");
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="stack" style={{ marginTop: "1rem" }}>
      <h3 style={{ margin: 0 }}>Write a review</h3>
      {error ? <div className="alert error">{error}</div> : null}
      {success ? <div className="alert">{success}</div> : null}
      <label>
        Rating
        <select name="rating" defaultValue="5" required>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} stars
            </option>
          ))}
        </select>
      </label>
      <label>
        Comment
        <textarea name="comment" required minLength={5} maxLength={500} />
      </label>
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Sending…" : "Submit review"}
      </button>
    </form>
  );
}
