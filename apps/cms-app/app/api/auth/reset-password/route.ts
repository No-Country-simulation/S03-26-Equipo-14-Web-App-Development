import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Leer la cookie guardada en el dominio del frontend y reenviarla al backend
  const resetToken = req.cookies.get('RESET_PASSWORD_TOKEN')?.value;

  if (!resetToken) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  const backendRes = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `RESET_PASSWORD_TOKEN=${resetToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(data, { status: backendRes.status });
  }

  // Limpiar la cookie RESET_PASSWORD_TOKEN del frontend
  const response = NextResponse.json(data);
  response.cookies.delete('RESET_PASSWORD_TOKEN');

  return response;
}
