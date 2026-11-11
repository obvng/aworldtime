import type { Metadata } from "next";
import { mainPageSeoByPath, type MainPageSeo } from "@/lib/main-page-seo";
import { getPageSeo } from "@/lib/page-seo";
import { buildPageMetadata } from "@/lib/seo";

export async function getEditableMainPageMetadata(path: MainPageSeo["path"]): Promise<Metadata> {
  const page = mainPageSeoByPath(path);
  if (!page) return {};
  const override = await getPageSeo(path);
  return buildPageMetadata({
    title: override?.seo_title || page.title,
    description: override?.meta_description || page.description,
    path,
    absoluteTitle: Boolean(override?.seo_title) || page.absoluteTitle,
  });
}
