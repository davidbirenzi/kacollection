import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <Logo href="/" />
          </div>
          <p>
            Authentic Rwandan crafts, coffee and textiles — woven, roasted and
            made by local cooperatives.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/products">Catalogue</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/cart">Cart</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p>KN 4 Ave, Nyarugenge, Kigali</p>
          <p>0791759449</p>
          <p>hello@kacollection.rw</p>
          <p>Mon–Sat · 08:00–18:00</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} KaCollection · Prices in RWF</p>
      </div>
    </footer>
  );
}
