'use client';

import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Separator,
} from '@repo/ui/components';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  LayoutDashboard,
  Settings2,
  Settings,
  LogOut,
  ChevronsUpDown,
  Component,
  Info,
} from '@repo/ui/lib';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Widgets', url: '/widgets', icon: Component },
  { title: 'Configuraciones', url: '/settings', icon: Settings2 },
];

// Cuando traigamos proyects debemos ordenar por id, siendo 0 la primera opcion para editor y "all" la primera opcion para admin/owner
const proyects = [
  { id: '0', title: 'Todos los proyectos' },
  { id: '1', title: 'Proyecto1' },
  { id: '2', title: 'Proyecto2' },
];

export function AppSidebar() {
  const [selected, setSelected] = useState<string | undefined>(proyects[0]?.id);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* Logo */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent active:bg-transparent cursor-default"
            >
              <div>
                <div className="flex p-2 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="size-4" />
                </div>
                <span className="truncate font-semibold">Geist EdTech</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Select de proyecto */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip="Seleccionar proyecto"
                  className="border-2"
                >
                  <ChevronsUpDown className="pr-1" />
                  <span className="truncate font-medium">
                    {proyects.find((p) => p.id === selected)?.title ?? 'Error'}
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={selected}
                  onValueChange={setSelected}
                >
                  {proyects.map((item) => (
                    <DropdownMenuRadioItem key={item.title} value={item.id}>
                      {item.title}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Contenido */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú del Proyecto X</SidebarGroupLabel>
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
      <SidebarFooter>
        {/* Botón de ayuda */}
        <SidebarMenu>
          <SidebarMenuItem key="help">
            <SidebarMenuButton asChild tooltip="Centro de ayuda">
              <a href="/help">
                <Info />
                <span>Centro de ayuda</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator />
        <SidebarMenu>
          {/* Avatar/nombre/rol/configs */}
          <SidebarMenuItem>
            <div className="flex items-center gap-2 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback className="rounded-lg">NU</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  Nombre del usuario
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Rol
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="ml-auto size-8 group-data-[collapsible=icon]:hidden"
                asChild
              >
                <a href="/account">
                  <Settings className="size-4" />
                </a>
              </Button>
            </div>
          </SidebarMenuItem>
          {/* Cerrar sesión */}
          <SidebarMenuItem key="logout">
            <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar sesión">
              <LogOut />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
