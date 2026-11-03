const faqs = [
  {
    q: "Do you deliver outside Kigali?",
    a: "Yes. Kigali deliveries usually arrive in 1–2 days. Upcountry orders take 2–4 days depending on the district.",
  },
  {
    q: "Are payments real?",
    a: "No. This CAT project uses simulated Mobile Money, card and cash-on-delivery confirmations. No real money is charged.",
  },
  {
    q: "Can I return a product?",
    a: "Unused items in original condition can be returned within 7 days. Contact us with your order number.",
  },
  {
    q: "Who makes the products?",
    a: "Most pieces come from registered cooperatives of weavers, coffee farmers and textile artisans across Rwanda.",
  },
];

export default function FaqPage() {
  return (
    <div className="container page-hero" style={{ paddingBottom: "3rem" }}>
      <p className="eyebrow">Help centre</p>
      <h1 className="page-title">Frequently asked questions</h1>
      <div className="stack" style={{ marginTop: "1.5rem" }}>
        {faqs.map((item) => (
          <article key={item.q} className="faq-item">
            <h3>{item.q}</h3>
            <p className="muted">{item.a}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
