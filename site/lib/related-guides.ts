import { isPublicPost, type Post } from "@/lib/posts";

type GuideRule = {
  slug: string;
  countryCodes?: string[];
  timeZones?: string[];
};

type GuideContext = {
  countryCode: string;
  timeZone?: string;
};

const GUIDE_RULES: GuideRule[] = [
  { slug: "is-toronto-on-est-or-edt", timeZones: ["America/Toronto"] },
  { slug: "is-vancouver-on-daylight-saving-time", timeZones: ["America/Vancouver"] },
  { slug: "is-utc-the-same-as-gmt", timeZones: ["Europe/London"] },
  { slug: "what-time-does-bangladesh-follow", countryCodes: ["BD"] },
  { slug: "what-time-does-china-use", countryCodes: ["CN"] },
  { slug: "what-time-does-brazil-use", countryCodes: ["BR"] },
  { slug: "why-india-is-5-hours-30-minutes-ahead-of-utc", countryCodes: ["IN"] },
];

export function selectRelatedGuides(posts: Post[], context: GuideContext, now = new Date()) {
  const countryCode = context.countryCode.trim().toUpperCase();
  const matchingSlugs = new Set(
    GUIDE_RULES
      .filter((rule) => rule.countryCodes?.includes(countryCode) || (context.timeZone && rule.timeZones?.includes(context.timeZone)))
      .map((rule) => rule.slug),
  );
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (!matchingSlugs.has(post.slug) || seen.has(post.slug) || !isPublicPost(post, now)) return false;
    seen.add(post.slug);
    return true;
  });
}
