'use client';

import { useQuery } from '@tanstack/react-query';
import { Badge, Skeleton } from '@repo/ui/components';
import { Component } from '@repo/ui/lib';
import apiClient from '@/shared/lib/apiClient';
import { useProjectStore } from '@/store/useProjectStore';
import { Testimonial } from '@/types/testimonials';
import { ApiKeySection } from './_components/api-key-section';
import { WidgetCard } from './_components/widget-card';

// ─── Skeleton de carga ────────────────────────────────────────────────────────

function WidgetSkeleton() {
  return (
    <div className="flex flex-col gap-3 border rounded-xl p-5">
      <Skeleton className="h-4 w-24" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-20 w-full rounded-md" />
      <Skeleton className="h-8 w-full rounded-md" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WidgetsPage() {
  const { currentProject } = useProjectStore();

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['widgets-published', currentProject?.id],
    queryFn: async () => {
      const r = await apiClient.get(`/testimonials/${currentProject!.id}?sorted=created_at:desc`);
      const all: Testimonial[] = r.data.data ?? [];
      return all.filter((t) => t.status === 'published');
    },
    enabled: !!currentProject?.id,
  });

  if (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <Component className="size-12 text-muted-foreground/50" />
        <p className="font-medium">Ningún proyecto seleccionado</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Selecciona un proyecto desde el menú lateral para ver sus widgets.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Widgets</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Copia el código de cada testimonio publicado e insértalo en tu sitio web.
          </p>
        </div>
        {!isLoading && testimonials.length > 0 && (
          <Badge variant="secondary" className="shrink-0 mt-1">
            {testimonials.length} publicado{testimonials.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Gestión de API Key */}
      <ApiKeySection projectId={currentProject.id} />

      {/* Grid de widgets */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <WidgetSkeleton key={i} />)}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 border rounded-xl text-center">
          <Component className="size-12 text-muted-foreground/50" />
          <p className="font-medium">Sin testimonios publicados</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Publica testimonios desde el Dashboard para que aparezcan aquí como widgets embebibles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => <WidgetCard key={t.id} testimonial={t} />)}
        </div>
      )}
    </div>
  );
}
