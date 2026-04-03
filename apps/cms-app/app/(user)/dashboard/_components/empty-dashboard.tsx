import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@repo/ui/components';

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
          <Plus /> Agrega tu primer testimonio
        </Button>
      </EmptyContent>
    </Empty>
  );
}
