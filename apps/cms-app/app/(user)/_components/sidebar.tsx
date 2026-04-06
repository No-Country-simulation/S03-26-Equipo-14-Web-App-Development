'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Separator,
} from '@repo/ui/components';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, Settings, LogOut, Info } from '@repo/ui/lib';
import { SidebarProjectSelector } from './sidebar-proyect-selector';
import { SidebarMain } from './sidebar-main';

export function AppSidebar() {
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
          <SidebarProjectSelector />
        </SidebarMenu>
      </SidebarHeader>
      {/* Contenido */}
      <SidebarMain />
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
