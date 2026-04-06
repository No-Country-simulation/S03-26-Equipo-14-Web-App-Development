'use client';

import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@repo/ui/components';

import { CircleAlert, RefreshCw } from '@repo/ui/lib';

export function ErrorMessage() {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleAlert />
        </EmptyMedia>
        <EmptyTitle>Algo salió mal</EmptyTitle>
        <EmptyDescription>
          No pudimos cargar la información en este momento, intenta refrescar la
          página o vuelve a intentarlo más tarde
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>
          <RefreshCw /> Reintentar
        </Button>
      </EmptyContent>
    </Empty>
  );
}
