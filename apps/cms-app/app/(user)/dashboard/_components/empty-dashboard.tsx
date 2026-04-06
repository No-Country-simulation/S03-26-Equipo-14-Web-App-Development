"use client";
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@repo/ui/components';
import Link from 'next/link';
import { MessageSquareQuote, Plus } from '@repo/ui/lib';
import { useRouter } from 'next/navigation';

export function EmptyDashboard() {
  const router = useRouter();
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageSquareQuote />
        </EmptyMedia>
        <EmptyTitle>Todavía no tenemos testimonios</EmptyTitle>
        <EmptyDescription>
          Empieza a recopilar la opinión de tus clientes para generar confianza
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button onClick={() => router.push('/testimonials/new')}>
          <Plus /> Agrega tu primer testimonio
        </Button>
      </EmptyContent>
    </Empty>
  );
}
