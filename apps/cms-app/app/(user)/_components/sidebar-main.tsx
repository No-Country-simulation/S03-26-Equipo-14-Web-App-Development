import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components';
import { LayoutDashboard, Settings2, Component } from '@repo/ui/lib';
import { useProjectStore } from '../../../store/useProjectStore';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Widgets', url: '/widgets', icon: Component },
  { title: 'Configuraciones', url: '/settings', icon: Settings2 },
];

export function SidebarMain() {
  const { projects, selectedProjectId } = useProjectStore();
  const currentProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menú de {currentProject?.title}</SidebarGroupLabel>
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
