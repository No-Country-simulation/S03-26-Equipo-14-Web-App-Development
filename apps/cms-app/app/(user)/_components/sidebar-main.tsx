import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components';
import { LayoutDashboard, Settings2, Component, Users } from '@repo/ui/lib';
import { useProjectStore } from '../../../store/useProjectStore';
import { useSession } from 'next-auth/react';

const baseNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Widgets', url: '/widgets', icon: Component },
  { title: 'Configuraciones', url: '/settings', icon: Settings2 },
];

export function SidebarMain() {
  const { currentProject } = useProjectStore();
  const { data: session } = useSession();
  const isOwner = session?.user?.role === 'Owner';

  const navItems = [
    ...baseNavItems,
    ...(isOwner
      ? [{ title: 'Miembros', url: '/members', icon: Users }]
      : []),
  ];

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menú de {currentProject?.name}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
