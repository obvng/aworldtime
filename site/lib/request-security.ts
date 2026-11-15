import { timingSafeEqual } from "node:crypto";
import { SITE_ORIGIN } from "@/lib/seo";

export function constantTimeSecretEqual(received: string | null, expected: string) {
  if (!received) return false;
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function allowedMutationOrigins(request: Request) {
  const origins = new Set([SITE_ORIGIN, "https://aworldtime.com"]);
  const vercelHost = process.env.VERCEL_URL;
  if (vercelHost) origins.add(`https://${vercelHost}`);
  if (process.env.NODE_ENV !== "production") origins.add(new URL(request.url).origin);
  return origins;
}

export function rejectCrossSiteMutation(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || !allowedMutationOrigins(request).has(origin)) {
    return Response.json({ error: "Cross-site request rejected." }, { status: 403 });
  }
  return null;
}

export function hasContentType(request: Request, expected: string) {
  return request.headers.get("content-type")?.toLowerCase().startsWith(expected) ?? false;
}

export function exceedsContentLength(request: Request, maximum: number) {
  const value = request.headers.get("content-length");
  if (!value) return false;
  const length = Number(value);
  return !Number.isFinite(length) || length < 0 || length > maximum;
}
