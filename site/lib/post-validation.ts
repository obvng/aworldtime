import { z } from "zod";

export function normalizeSlug(value: string) {
  return value.trim().toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(180),
  slug: z.string().transform(normalizeSlug).pipe(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a readable URL slug.")),
  excerpt: z.string().trim().max(320).default(""),
  content: z.string().trim().min(1, "Article content is required."),
  category: z.string().trim().min(1).max(80).default("Guides"),
  featured_image_url: z.union([z.literal(""), z.string().url()]).optional().default(""),
  featured_image_alt: z.string().trim().max(240).optional().default(""),
  status: z.enum(["draft", "scheduled", "published"]),
  published_at: z.string().optional().default(""),
  seo_title: z.string().trim().max(180).optional().default(""),
  meta_description: z.string().trim().max(320).optional().default(""),
  canonical_url: z.union([z.literal(""), z.string().url()]).optional().default(""),
  og_title: z.string().trim().max(180).optional().default(""),
  og_description: z.string().trim().max(320).optional().default(""),
  noindex: z.boolean().default(false),
}).superRefine((value, context) => {
  if (value.status === "scheduled" && !value.published_at) context.addIssue({ code: "custom", path: ["published_at"], message: "Choose a publication date for a scheduled post." });
  if (value.featured_image_url && !value.featured_image_alt) context.addIssue({ code: "custom", path: ["featured_image_alt"], message: "Describe the featured image for screen-reader users." });
});
