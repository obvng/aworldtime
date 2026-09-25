import Link from "next/link";

type PostCardProps = {
  title: string;
  excerpt: string;
  category: string;
  href: string;
  imageUrl?: string | null;
};

export function PostCard({ title, excerpt, category, href, imageUrl }: PostCardProps) {
  return (
    <article className="post-card">
      <div
        className="post-card-image"
        aria-hidden="true"
        style={{ backgroundImage: `url("${imageUrl || "/cities/new-york.webp"}")` }}
      />
      <div className="post-card-copy">
        <p>{category}</p>
        <h3><Link href={href}>{title}</Link></h3>
        <span>{excerpt}</span>
      </div>
    </article>
  );
}
