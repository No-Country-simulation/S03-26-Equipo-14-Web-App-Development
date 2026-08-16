import { NextResponse } from 'next/server';

export async function GET() {
  const apiBaseUrl = process.env.API_URL ?? 'http://localhost:3000';
  const embedApiKey = process.env.EMBED_API_KEY ?? '';

  if (!embedApiKey) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const res = await fetch(`${apiBaseUrl}/embed`, {
      headers: { 'x-embed-key': embedApiKey },
      next: { revalidate: 60 },
    });
    if (!res.ok) return NextResponse.json([], { status: 200 });
    const data = await res.json();
    const testimonials = Array.isArray(data) ? data : (data?.data ?? []);
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
