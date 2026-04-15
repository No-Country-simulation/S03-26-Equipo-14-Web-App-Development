'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Separator,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components';
import { Check, Code2, Component, Copy, Eye, Monitor, Moon, Sun } from '@repo/ui/lib';
import apiClient from '@/shared/lib/apiClient';
import { useProjectStore } from '@/store/useProjectStore';
import { Testimonial } from '@/types/testimonials';
import { TestimonialTypeBadge } from '../dashboard/_components/testimonial-type-badge';

// ─── Preview dialog ───────────────────────────────────────────────────────────

function PreviewDialog({
  testimonial,
  open,
  onOpenChange,
}: {
  testimonial: Testimonial;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const src = `${origin}/embed/testimonials/${testimonial.id}?theme=${theme}`;
  const aspectRatio = testimonial.media_url ? '1 / 1' : '21 / 9';
  const widgetCode =
    `<div style="position: relative; width: 100%; aspect-ratio: ${aspectRatio};">\n` +
    `  <iframe src="${src}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"></iframe>\n` +
    `</div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-none w-[92vw] md:w-[70vw] max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="size-4" />
            Vista previa — {testimonial.author}
          </DialogTitle>
        </DialogHeader>

        {/* Selector de tema */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Tema:</span>
          <Tabs value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark')}>
            <TabsList className="h-7">
              <TabsTrigger value="light" className="text-xs px-3 py-0.5 gap-1">
                <Sun className="size-3" /> Claro
              </TabsTrigger>
              <TabsTrigger value="dark" className="text-xs px-3 py-0.5 gap-1">
                <Moon className="size-3" /> Oscuro
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Vista previa del iframe */}
        <div
          className={`w-full rounded-xl border overflow-hidden ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'}`}
        >
          <div className="flex items-center gap-1.5 px-3 py-2 border-b bg-muted/60">
            <Monitor className="size-3.5 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground font-mono truncate">{src}</span>
          </div>
          <div className="p-4">
            <div style={{ position: 'relative', width: '100%', aspectRatio }}>
              <iframe
                key={`${testimonial.id}-${theme}`}
                src={src}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title={`Widget — ${testimonial.author}`}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Código */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Code2 className="size-3.5" />
            Código embebido
          </div>
          <pre className="bg-muted rounded-md p-3 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
            {widgetCode}
          </pre>
          <Button
            size="sm"
            variant={copied ? 'outline' : 'secondary'}
            className={`w-full transition-colors ${copied ? 'border-green-500 text-green-600' : ''}`}
            onClick={handleCopy}
          >
            {copied ? (
              <><Check className="size-3.5 mr-1.5" />¡Copiado!</>
            ) : (
              <><Copy className="size-3.5 mr-1.5" />Copiar código</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Widget card ─────────────────────────────────────────────────────────────

function WidgetCard({ testimonial }: { testimonial: Testimonial; }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const src = `${origin}/embed/testimonials/${testimonial.id}?theme=${theme}`;
  const aspectRatio = testimonial.media_url ? '1 / 1' : '21 / 9';
  const widgetCode =
    `<div style="position: relative; width: 100%; aspect-ratio: ${aspectRatio};">\n` +
    `  <iframe src="${src}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"></iframe>\n` +
    `</div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardAction>
          <TestimonialTypeBadge type={testimonial.type} />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        {/* Autor */}
        <div className="flex items-center gap-2">
          {testimonial.author_photo ? (
            <img
              src={testimonial.author_photo}
              alt={testimonial.author}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
              {testimonial.author
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{testimonial.author}</p>
            {testimonial.authorRole && (
              <p className="text-xs text-muted-foreground truncate">{testimonial.authorRole}</p>
            )}
          </div>
        </div>

        {/* Título / contenido */}
        {testimonial.name && (
          <p className="text-sm font-medium leading-snug line-clamp-2">{testimonial.name}</p>
        )}
        {testimonial.content && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {testimonial.content}
          </p>
        )}

        <Separator />

        {/* Generador de código */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Code2 className="size-3.5" />
            Código embebido
          </div>

          <Tabs
            value={theme}
            onValueChange={(v) => setTheme(v as 'light' | 'dark')}
          >
            <TabsList className="h-7">
              <TabsTrigger value="light" className="text-xs px-3 py-0.5">
                Claro
              </TabsTrigger>
              <TabsTrigger value="dark" className="text-xs px-3 py-0.5">
                Oscuro
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <pre className="bg-muted rounded-md p-2.5 text-[10px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
            {widgetCode}
          </pre>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => setPreviewOpen(true)}
        >
          <Eye className="size-3.5 mr-1.5" />
          Vista previa
        </Button>
        <Button
          size="sm"
          variant={copied ? 'outline' : 'secondary'}
          className={`flex-1 transition-colors ${copied ? 'border-green-500 text-green-600' : ''}`}
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="size-3.5 mr-1.5" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy className="size-3.5 mr-1.5" />
              Copiar código
            </>
          )}
        </Button>
      </CardFooter>

      <PreviewDialog
        testimonial={testimonial}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </Card>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

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
      const r = await apiClient.get(
        `/testimonials/${currentProject!.id}?sorted=created_at:desc`,
      );
      const all: Testimonial[] = r.data.data ?? [];
      return all.filter((t) => t.status === 'published');
    },
    enabled: !!currentProject?.id,
  });

  // Sin proyecto seleccionado
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
      {/* Header */}
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

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <WidgetSkeleton key={i} />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 border rounded-xl text-center">
          <Component className="size-12 text-muted-foreground/50" />
          <p className="font-medium">Sin testimonios publicados</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Publica testimonios desde el Dashboard para que aparezcan aquí como
            widgets embebibles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <WidgetCard key={t.id} testimonial={t} />
          ))}
        </div>
      )}
    </div>
  );
}

