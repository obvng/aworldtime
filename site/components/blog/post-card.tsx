import Link from "next/link";

type PostCardProps = {
  title: string;
  excerpt: string;
  category: string;
  href: string;
};

export function PostCard({ title, excerpt, category, href }: PostCardProps) {
  return (
    <article className="post-card">
      <p>{category}</p>
      <h3><Link href={href}>{title}</Link></h3>
      <span>{excerpt}</span>
    </article>
  );
}
