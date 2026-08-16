'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Toaster, TooltipProvider } from '@repo/ui';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
          <Toaster richColors theme="light" position="top-right" />
        </TooltipProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
