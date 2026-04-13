'use client';
import { Button, Skeleton } from "@repo/ui/components";
import { BookOpen } from '@repo/ui/lib';
import { useSession } from 'next-auth/react';
import Link from "next/link";

export function LandingNavbar() {
  const { data: session, status } = useSession();
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className='text-white' />
          </div>
          <span className="font-semibold text-gray-900 text-sm">
            Geist EdTech
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#funcionalidades"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Funcionalidades
          </Link>
          <Link
            href="#precios"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Precios
          </Link>
        </nav>

        {/* Auth buttons */}
        {status === 'loading' ? (
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-20" />
          </div>
        ) : session?.user?.id ? (<>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              asChild
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </>) : (<>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-gray-700 font-medium"
              asChild
            >
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button
              size="sm"
              className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
              asChild
            >
              <Link href="/auth/login">Registrarse</Link>
            </Button>
          </div>
        </>)}
      </div>
    </header>
  );
}
