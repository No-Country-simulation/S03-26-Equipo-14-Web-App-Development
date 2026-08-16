import { authConfig } from '@/auth.config';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { SidebarProvider, SidebarInset } from '@repo/ui/components';
import { AppSidebar } from './_components/sidebar';
import { Header } from './_components/header';

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
        <Header />
        <main className="flex flex-col px-8 pt-4 pb-8 h-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
