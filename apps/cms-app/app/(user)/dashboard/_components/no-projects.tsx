'use client';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@repo/ui/components';

import { Ghost } from '@repo/ui/lib';

export function NoProjects() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Ghost />
        </EmptyMedia>
        <EmptyTitle>Sin proyectos asignados</EmptyTitle>
        <EmptyDescription>
          Tu lista de proyectos está vacía por ahora. Contacta a tu
          administrador o vuelve más tarde.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
