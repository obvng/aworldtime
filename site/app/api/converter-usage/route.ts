import { NextResponse } from "next/server";
import { normalizeConverterPair } from "@/lib/converter-usage";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  try {
    const input = body as { from?: string; to?: string };
    const pair = normalizeConverterPair(input.from ?? "", input.to ?? "");
    if (hasSupabaseConfig()) {
      const supabase = await createClient();
      const { error } = await supabase.from("converter_pair_events").insert({ city_a: pair.cityA, city_b: pair.cityB });
      if (error) throw error;
    }
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Choose two valid cities." }, { status: 400 });
  }
}
