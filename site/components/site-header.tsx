import Link from "next/link";
import { Globe2, Menu, Search } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="AWORLDTIME.COM home">
        <span className="brand-mark"><Globe2 aria-hidden="true" /></span>
        <span>AWORLDTIME.COM</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/world-clock">World Clock</Link>
        <Link href="/converter">Convert</Link>
        <Link href="/blog">Blog</Link>
      </nav>
      <div className="header-actions">
        <Link href="/world-clock" aria-label="Search cities"><Search aria-hidden="true" /></Link>
        <button type="button" aria-label="Open menu"><Menu aria-hidden="true" /></button>
      </div>
    </header>
  );
}
