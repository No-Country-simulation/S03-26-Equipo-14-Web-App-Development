import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@repo/ui/components';

import { LucideSearchX } from '@repo/ui/lib';

export function NoResults() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <LucideSearchX />
        </EmptyMedia>
        <EmptyTitle>Sin resultados</EmptyTitle>
        <EmptyDescription>
          No encontramos testimonios que coincidan con tus filtros, intenta
          ajustar la búsqueda
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
