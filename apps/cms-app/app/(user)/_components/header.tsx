'use client';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@repo/ui/components';

export function Header() {
  const pathname = usePathname();
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/settings': 'Configuraciones',
    '/widgets': 'Widgets',
    '/help': 'Centro de ayuda',
    '/account': 'Configuración de cuenta',
    '/testimonials/new': 'Crear testimonio',
    '/testimonials/edit': 'Editar testimonio',
  };
  const title = Object.keys(titles).find((key) => pathname.includes(key))
    ? titles[Object.keys(titles).find((key) => pathname.includes(key))!]
    : 'Dashboard';

  return (
    <header className="flex flex-row pr-10 py-4 gap-3 shadow-[0_20px_40px_0_rgba(28,27,29,0.04)]">
      <SidebarTrigger />
      <h1 className="text-xl font-bold truncate">{title}</h1>
    </header>
  );
}
