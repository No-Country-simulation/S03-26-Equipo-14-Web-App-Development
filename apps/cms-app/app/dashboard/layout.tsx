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
        <header className="flex flex-row">
          <SidebarTrigger />
          <h1>Título</h1>
        </header>
        <main className="flex flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
