import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (clean(body.hp, 50)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const lead = {
    name: clean(body.name, 80),
    email: clean(body.email, 120).toLowerCase(),
    phone: clean(body.phone, 20),
    business_name: clean(body.businessName, 80),
    category: clean(body.category, 60),
    city: clean(body.city, 60),
    score: Number.isFinite(Number(body.score)) ? Math.max(0, Math.min(100, Math.round(Number(body.score)))) : null,
  };

  if (lead.name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL.test(lead.email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if (lead.phone && !/^[+\d][\d\s-]{6,18}$/.test(lead.phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // Not connected to a database yet: the lead shows up in Vercel > Logs.
    console.log("NEW_LEAD", JSON.stringify(lead));
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(lead),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("Supabase insert failed", res.status, await res.text());
      console.log("NEW_LEAD", JSON.stringify(lead));
    }
  } catch (e) {
    console.error("Supabase error", e);
    console.log("NEW_LEAD", JSON.stringify(lead));
  }
  // The user still gets the report even if saving failed; the lead is in the logs.
  return NextResponse.json({ ok: true });
}
