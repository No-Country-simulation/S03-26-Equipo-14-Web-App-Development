import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendRes = await fetch(
    `${API_URL}/auth/validate-token?${req.nextUrl.searchParams.toString()}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  // Reenviar la cookie RESET_PASSWORD_TOKEN al browser bajo el dominio del frontend
  const setCookie = backendRes.headers.get('set-cookie');
  const response = NextResponse.json(data);
  if (setCookie) {
    response.headers.set('set-cookie', setCookie);
  }

  return response;
}
