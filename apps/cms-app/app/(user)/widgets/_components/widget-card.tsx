'use client';

import { useState } from 'react';
import {
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
  Tabs,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components';
import { Check, Code2, Copy, Eye, Monitor, Moon, Sun } from '@repo/ui/lib';
import { Testimonial } from '@/types/testimonials';
import { TestimonialTypeBadge } from '../../dashboard/_components/testimonial-type-badge';

// ─── Preview dialog ───────────────────────────────────────────────────────────

function useWidgetCode(testimonialId: string, mediaUrl: string | undefined, theme: 'light' | 'dark') {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const src = `${origin}/embed/testimonials/${testimonialId}?theme=${theme}`;
  const aspectRatio = mediaUrl ? '1 / 1' : '21 / 9';
  const code =
    `<div style="position: relative; width: 100%; aspect-ratio: ${aspectRatio};">\n` +
    `  <iframe src="${src}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"></iframe>\n` +
    `</div>`;
  return { src, aspectRatio, code };
}

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
  const { src, aspectRatio, code } = useWidgetCode(testimonial.id, testimonial.media_url, theme);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
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

        {/* Browser mock con iframe */}
        <div className={`w-full rounded-xl border overflow-hidden ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1.5 px-3 py-2 border-b bg-muted/60">
            <Monitor className="size-3.5 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground font-mono truncate">{src}</span>
          </div>
          <div className="p-4">
            <div style={{ position: 'relative', width: '100%', aspectRatio }}>
              <iframe
                key={`${testimonial.id}-${theme}`}
                src={src}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                title={`Widget — ${testimonial.author}`}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Código embebido */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Code2 className="size-3.5" />
            Código embebido
          </div>
          <pre className="bg-muted rounded-md p-3 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
            {code}
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

// ─── Widget card ──────────────────────────────────────────────────────────────

export function WidgetCard({ testimonial }: { testimonial: Testimonial; }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { code } = useWidgetCode(testimonial.id, testimonial.media_url, theme);

  const initials = testimonial.author
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={testimonial.author_photo}
              alt={testimonial.author}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{testimonial.author}</p>
            {testimonial.authorRole && (
              <p className="text-xs text-muted-foreground truncate">{testimonial.authorRole}</p>
            )}
          </div>
        </div>

        {testimonial.name && (
          <p className="text-sm font-medium leading-snug line-clamp-2">{testimonial.name}</p>
        )}
        {testimonial.content && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{testimonial.content}</p>
        )}

        <Separator />

        {/* Selector de tema + código */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Code2 className="size-3.5" />
            Código embebido
          </div>
          <Tabs value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark')}>
            <TabsList className="h-7">
              <TabsTrigger value="light" className="text-xs px-3 py-0.5">Claro</TabsTrigger>
              <TabsTrigger value="dark" className="text-xs px-3 py-0.5">Oscuro</TabsTrigger>
            </TabsList>
          </Tabs>
          <pre className="bg-muted rounded-md p-2.5 text-[10px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
            {code}
          </pre>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1" onClick={() => setPreviewOpen(true)}>
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
            <><Check className="size-3.5 mr-1.5" />¡Copiado!</>
          ) : (
            <><Copy className="size-3.5 mr-1.5" />Copiar código</>
          )}
        </Button>
      </CardFooter>

      <PreviewDialog testimonial={testimonial} open={previewOpen} onOpenChange={setPreviewOpen} />
    </Card>
  );
}
