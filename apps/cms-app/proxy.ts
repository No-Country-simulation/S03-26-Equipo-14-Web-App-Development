import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default async function proxy(request: NextRequest) {
  const isProd = process.env.NODE_ENV === 'production' ? true : false;
  const isAuthenticated = request.cookies.get(
    isProd ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
  )?.value;
  const pathname = request.nextUrl.pathname;

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/dashboard'];
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
