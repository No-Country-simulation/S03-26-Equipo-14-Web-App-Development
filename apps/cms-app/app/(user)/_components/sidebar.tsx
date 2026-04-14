'use client';

import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BookOpen, ChevronsUpDown, Info, LogOut, Settings, UserRound } from '@repo/ui/lib';
import { SidebarProjectSelector } from './sidebar-proyect-selector';
import { SidebarMain } from './sidebar-main';

function getInitials(name?: string | null) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function AppSidebar() {
  const router = useRouter();
  const { data: session } = useSession();

  const userName = session?.user?.name ?? 'Usuario';
  const userEmail = session?.user?.email ?? '';
  const userRole = session?.user?.role ?? 'Miembro';

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
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
          <SidebarProjectSelector />
        </SidebarMenu>
      </SidebarHeader>

      <SidebarMain />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem key="help">
            <SidebarMenuButton asChild tooltip="Centro de ayuda">
              <a href="/help">
                <Info className="size-4" />
                <span>Centro de ayuda</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={userName}
                >
                  <Avatar className="h-8 w-8 rounded-lg shrink-0">
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userName}</span>
                    <span className="truncate text-xs text-muted-foreground">{userRole}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5">
                    <Avatar className="h-8 w-8 rounded-lg shrink-0">
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                        {getInitials(userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userName}</span>
                      <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push('/account')}>
                  <UserRound className="size-4" />
                  Mi perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="size-4" />
                  Configuraciones
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
