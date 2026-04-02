import { authConfig } from '@/auth.config';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@repo/ui/components';
import { AppSidebar } from './_components/sidebar-dashboard';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  if (!session) {
    redirect('/auth/login');
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex flex-row pr-10 py-4 gap-3">
          <SidebarTrigger />
          <h1 className="text-xl font-bold truncate">Título</h1>
        </header>
        <main className="flex flex-col px-8 pt-4 pb-8 h-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
