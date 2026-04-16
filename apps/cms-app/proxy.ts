import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.JWT_SECRET,
  });
  const isAuthenticated = !!token;
  const pathname = request.nextUrl.pathname;

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = [
    '/dashboard',
    '/account',
    '/help',
    '/settings',
    '/widgets',
    '/testimonials',
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if ((isProtectedRoute && !isAuthenticated) || pathname === '/auth') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Si está autenticado y trata de ir a login, redirige al dashboard
  if (pathname === '/auth/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
