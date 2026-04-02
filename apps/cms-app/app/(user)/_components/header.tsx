'use client';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@repo/ui/components';

export function Header() {
  const pathname = usePathname();
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/settings': 'Configuraciones de proyecto',
    '/widgets': 'Widgets',
  };
  const title = titles[pathname] || 'Dashboard';

  return (
    <header className="flex flex-row pr-10 py-4 gap-3">
      <SidebarTrigger />
      <h1 className="text-xl font-bold truncate">{title}</h1>
    </header>
  );
}
