'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
  Input,
  Separator,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  toast,
} from '@repo/ui/components';
import {
  AlertTriangle,
  BookOpen,
  Check,
  Code2,
  Component,
  Copy,
  Eye,
  EyeOff,
  Key,
  Monitor,
  Moon,
  RefreshCw,
  Shield,
  Sun,
} from '@repo/ui/lib';
import apiClient from '@/shared/lib/apiClient';
import { useProjectStore } from '@/store/useProjectStore';
import { Testimonial } from '@/types/testimonials';
import { TestimonialTypeBadge } from '../dashboard/_components/testimonial-type-badge';

// ─── API Key section ──────────────────────────────────────────────────────────

type ProjectDetail = {
  id: string;
  name: string;
  api_key?: string | null;
};

function ApiKeySection({ projectId }: { projectId: string; }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isOwner = session?.user?.role?.toLowerCase() === 'owner';

  const [docsOpen, setDocsOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copiedNewKey, setCopiedNewKey] = useState(false);

  const { data: project, isLoading: loadingProject } = useQuery<ProjectDetail>({
    queryKey: ['project-detail', projectId],
    queryFn: async () => {
      const r = await apiClient.get(`/projects/${projectId}`);
      return r.data.data ?? r.data;
    },
    enabled: !!projectId,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const r = await apiClient.post(`/projects/${projectId}/api-key`);
      return r.data.apiKey as string;
    },
    onSuccess: (apiKey) => {
      setNewKey(apiKey);
      setRevealed(false);
      queryClient.invalidateQueries({ queryKey: ['project-detail', projectId] });
    },
    onError: () => {
      toast.error('No se pudo generar la API Key. Solo el propietario puede hacerlo.');
    },
  });

  const maskedKey = (key: string) =>
    `${key.slice(0, 18)}${'•'.repeat(Math.max(0, key.length - 22))}${key.slice(-4)}`;

  const handleCopyKey = (key: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(key);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  const currentKey = project?.api_key;

  return (
    <div className="rounded-xl border p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-primary" />
          <div>
            <p className="font-semibold text-sm">API Key del proyecto</p>
            <p className="text-xs text-muted-foreground">
              Úsala en el header <code className="bg-muted px-1 rounded">x-embed-key</code> para acceder al endpoint público de testimonios.
            </p>
          </div>
        </div>        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Button size="sm" variant="ghost" onClick={() => setDocsOpen(true)}>
            <BookOpen className="size-3.5 mr-1.5" />
            ¿Cómo usar?
          </Button>        {isOwner && (
            <Button
              size="sm"
              variant="outline"
              disabled={generateMutation.isPending}
              onClick={() => generateMutation.mutate()}
            >
              <RefreshCw className={`size-3.5 mr-1.5 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
              {currentKey ? 'Regenerar clave' : 'Generar clave'}
            </Button>
          )}
        </div>
      </div>

      <ApiKeyDocsDialog open={docsOpen} onOpenChange={setDocsOpen} />

      {/* Clave actual */}
      {loadingProject ? (
        <Skeleton className="h-9 w-full rounded-md" />
      ) : currentKey ? (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              readOnly
              value={revealed ? currentKey : maskedKey(currentKey)}
              className="pr-10 font-mono text-xs"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setRevealed((v) => !v)}
              aria-label={revealed ? 'Ocultar clave' : 'Revelar clave'}
            >
              {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <Button
            size="sm"
            variant={copiedKey ? 'outline' : 'secondary'}
            className={copiedKey ? 'border-green-500 text-green-600' : ''}
            onClick={() => handleCopyKey(currentKey, setCopiedKey)}
          >
            {copiedKey ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-muted-foreground border border-dashed rounded-md px-4 py-3">
          <Key className="size-4 shrink-0" />
          {isOwner
            ? 'Este proyecto aún no tiene API Key. Genera una para habilitar el embed.'
            : 'Sin API Key configurada. Contacta al propietario del proyecto.'}
        </div>
      )}

      {/* Aviso de clave nueva (one-time) */}
      {newKey && (
        <Alert className="border-amber-400 bg-amber-50 dark:bg-amber-950/20">
          <AlertTriangle className="size-4 text-amber-600" />
          <AlertTitle className="text-amber-700 dark:text-amber-400">
            Guarda esta clave ahora
          </AlertTitle>
          <AlertDescription className="space-y-2">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Esta es la única vez que verás la clave completa. Cópiala y almacénala de forma segura.
            </p>
            <div className="flex gap-2">
              <Input
                readOnly
                value={newKey}
                className="font-mono text-xs bg-white dark:bg-zinc-900"
              />
              <Button
                size="sm"
                variant={copiedNewKey ? 'outline' : 'secondary'}
                className={copiedNewKey ? 'border-green-500 text-green-600 shrink-0' : 'shrink-0'}
                onClick={() => handleCopyKey(newKey, setCopiedNewKey)}
              >
                {copiedNewKey ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// ─── API Key docs dialog ─────────────────────────────────────────────────────

function ApiKeyDocsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied((p) => ({ ...p, [id]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [id]: false })), 2000);
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

  const snippets = {
    fetch: `fetch('${apiUrl}/embed', {
  headers: { 'x-embed-key': 'cms-api-key:...' },
})
  .then(r => r.json())
  .then(data => console.log(data));`,

    curl: `curl ${apiUrl}/embed \\
  -H 'x-embed-key: cms-api-key:...'`,

    env: `# .env
EMBED_API_KEY=cms-api-key:...`,

    react: `import { useEffect, useState } from 'react';

export function Testimonials() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/get-testimonials') // tu proxy seguro
      .then(r => r.json())
      .then(setItems);
  }, []);

  return (
    <div>{items.map(t => <p key={t.id}>{t.content}</p>)}</div>
  );
}`,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-none w-[92vw] md:w-[680px] max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="size-4" />
            Cómo usar la API Key
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          {/* Intro */}
          <p className="text-muted-foreground">
            La API Key permite a tu sitio web obtener los testimonios publicados
            de este proyecto de forma autenticada a través del endpoint público:
          </p>
          <code className="block bg-muted rounded px-3 py-2 font-mono text-xs break-all">
            GET {apiUrl}/embed
          </code>

          <Separator />

          {/* Paso 1 */}
          <section className="space-y-2">
            <h3 className="font-semibold flex items-center gap-1.5">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">1</span>
              Genera o copia tu clave
            </h3>
            <p className="text-muted-foreground text-xs">
              Desde la sección <strong>API Key del proyecto</strong> (arriba), genera tu clave
              si no tienes una. Solo el propietario puede hacerla. Cópiala y guárdala
              en un lugar seguro — no se volverá a mostrar completa.
            </p>
          </section>

          {/* Paso 2 */}
          <section className="space-y-2">
            <h3 className="font-semibold flex items-center gap-1.5">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">2</span>
              Súbela como variable de entorno
            </h3>
            <p className="text-muted-foreground text-xs mb-2">
              Nunca incluyas la clave directamente en tu código fuente. Usa una variable de entorno.
            </p>
            <CodeBlock id="env" code={snippets.env} copied={copied} onCopy={copy} />
          </section>

          {/* Paso 3 */}
          <section className="space-y-2">
            <h3 className="font-semibold flex items-center gap-1.5">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">3</span>
              Llama al endpoint desde tu servidor
            </h3>
            <p className="text-muted-foreground text-xs mb-2">
              Usa el header <code className="bg-muted rounded px-1 font-mono">x-embed-key</code> en cada petición.
              Se recomienda hacerlo desde un servidor (API route, backend) para no exponer la clave al navegador.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">fetch (Node / server-side)</p>
              <CodeBlock id="fetch" code={snippets.fetch} copied={copied} onCopy={copy} />
              <p className="text-xs font-medium text-muted-foreground">cURL</p>
              <CodeBlock id="curl" code={snippets.curl} copied={copied} onCopy={copy} />
            </div>
          </section>

          {/* Paso 4 */}
          <section className="space-y-2">
            <h3 className="font-semibold flex items-center gap-1.5">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">4</span>
              Muestra los testimonios en tu sitio
            </h3>
            <p className="text-muted-foreground text-xs mb-2">
              Crea una API route en tu proyecto (Next.js, Express, etc.) que actúe como proxy
              seguro, y consúmela desde el cliente:
            </p>
            <CodeBlock id="react" code={snippets.react} copied={copied} onCopy={copy} />
          </section>

          <Separator />

          {/* Respuesta */}
          <section className="space-y-2">
            <h3 className="font-semibold">Estructura de la respuesta</h3>
            <p className="text-muted-foreground text-xs">
              El endpoint devuelve un array de objetos con los testimonios publicados:
            </p>
            <pre className="bg-muted rounded-md p-3 text-[11px] leading-relaxed overflow-x-auto">{`[
  {
    "id": "uuid",
    "type": "quote" | "case" | "video",
    "title": "...",
    "content": "...",
    "author": "Nombre Apellido",
    "author_role": "CEO en Empresa",
    "author_photo": "https://...",
    "media_url": "https://youtube.com/...",
    "rating": 5
  }
]`}</pre>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CodeBlock({
  id,
  code,
  copied,
  onCopy,
}: {
  id: string;
  code: string;
  copied: Record<string, boolean>;
  onCopy: (id: string, text: string) => void;
}) {
  return (
    <div className="relative">
      <pre className="bg-muted rounded-md p-3 pr-10 text-[11px] leading-relaxed overflow-x-auto whitespace-pre">
        {code}
      </pre>
      <button
        type="button"
        onClick={() => onCopy(id, code)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Copiar"
      >
        {copied[id] ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

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

      {/* API Key */}
      <ApiKeySection projectId={currentProject.id} />

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

