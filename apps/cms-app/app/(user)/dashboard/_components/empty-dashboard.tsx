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

export function EmptyDashboard() {
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
        <Button>
          <Link className="flex items-center gap-1" href="/form">
            <Plus /> Agrega tu primer testimonio
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
