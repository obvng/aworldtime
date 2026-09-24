import { NextResponse } from "next/server";
import { getWeatherSummary } from "@/lib/weather";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const latitude = Number(url.searchParams.get("latitude"));
  const longitude = Number(url.searchParams.get("longitude"));

  if (
    !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
    !Number.isFinite(longitude) || longitude < -180 || longitude > 180
  ) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);
  try {
    const weather = await getWeatherSummary(latitude, longitude, controller.signal);
    if (!weather) return new Response(null, { status: 204 });
    return NextResponse.json(weather, {
      headers: { "Cache-Control": "public, max-age=900, stale-while-revalidate=1800" },
    });
  } catch {
    return new Response(null, { status: 204 });
  } finally {
    clearTimeout(timeout);
  }
}
