'use client';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@repo/ui/components';

export function Header() {
  const pathname = usePathname();
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/settings': 'Configuraciones de proyecto',
    '/widgets': 'Widgets',
    '/help': 'Centro de ayuda',
    '/account': 'Configuración de cuenta',
  };
  const title = titles[pathname] || 'Dashboard';

  return (
    <header className="flex flex-row pr-10 py-4 gap-3 shadow-[0_20px_40px_0_rgba(28,27,29,0.04)]">
      <SidebarTrigger />
      <h1 className="text-xl font-bold truncate">{title}</h1>
    </header>
  );
}
