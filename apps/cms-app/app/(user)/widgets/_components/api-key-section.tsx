'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Separator,
  Skeleton,
  toast,
} from '@repo/ui/components';
import { AlertTriangle, BookOpen, Check, Copy, Eye, EyeOff, Key, RefreshCw, Shield } from '@repo/ui/lib';
import apiClient from '@/shared/lib/apiClient';
import { CodeBlock } from './code-block';

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectDetail = {
  id: string;
  name: string;
  api_key?: string | null;
};

// ─── Docs dialog ──────────────────────────────────────────────────────────────

function ApiKeyDocsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied((p) => ({ ...p, [id]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [id]: false })), 2000);
  };

  const snippets = {
    env: `# .env\nEMBED_API_KEY=cms-api-key:...`,
    fetch: `fetch('${apiUrl}/embed', {\n  headers: { 'x-embed-key': 'cms-api-key:...' },\n})\n  .then(r => r.json())\n  .then(data => console.log(data));`,
    curl: `curl ${apiUrl}/embed \\\n  -H 'x-embed-key: cms-api-key:...'`,
    react: `import { useEffect, useState } from 'react';\n\nexport function Testimonials() {\n  const [items, setItems] = useState([]);\n\n  useEffect(() => {\n    fetch('/api/get-testimonials') // tu proxy seguro\n      .then(r => r.json())\n      .then(setItems);\n  }, []);\n\n  return (\n    <div>{items.map(t => <p key={t.id}>{t.content}</p>)}</div>\n  );\n}`,
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
          <div className="space-y-2">
            <p className="text-muted-foreground">
              La API Key permite obtener los testimonios publicados de forma autenticada
              a través del endpoint público:
            </p>
            <code className="block bg-muted rounded px-3 py-2 font-mono text-xs break-all">
              GET {apiUrl}/embed
            </code>
          </div>

          <Separator />

          <Step number={1} title="Genera o copia tu clave">
            Desde la sección <strong>API Key del proyecto</strong> (arriba), genera tu clave
            si no tienes una. Solo el propietario puede hacerlo. Cópiala y guárdala en un lugar
            seguro — no se volverá a mostrar completa.
          </Step>

          <Step number={2} title="Súbela como variable de entorno">
            <p className="text-muted-foreground text-xs mb-2">
              Nunca incluyas la clave directamente en tu código fuente.
            </p>
            <CodeBlock id="env" code={snippets.env} copied={copied} onCopy={copy} />
          </Step>

          <Step number={3} title="Llama al endpoint desde tu servidor">
            <p className="text-muted-foreground text-xs mb-2">
              Usa el header{' '}
              <code className="bg-muted rounded px-1 font-mono">x-embed-key</code>{' '}
              en cada petición. Hazlo server-side para no exponer la clave al navegador.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">fetch (Node / server-side)</p>
              <CodeBlock id="fetch" code={snippets.fetch} copied={copied} onCopy={copy} />
              <p className="text-xs font-medium text-muted-foreground">cURL</p>
              <CodeBlock id="curl" code={snippets.curl} copied={copied} onCopy={copy} />
            </div>
          </Step>

          <Step number={4} title="Muestra los testimonios en tu sitio">
            <p className="text-muted-foreground text-xs mb-2">
              Crea una API route que actúe como proxy seguro y consúmela desde el cliente:
            </p>
            <CodeBlock id="react" code={snippets.react} copied={copied} onCopy={copy} />
          </Step>

          <Separator />

          <section className="space-y-2">
            <h3 className="font-semibold">Estructura de la respuesta</h3>
            <p className="text-muted-foreground text-xs">
              El endpoint devuelve un array con los testimonios publicados:
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

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="font-semibold flex items-center gap-1.5">
        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">
          {number}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

// ─── API Key section ──────────────────────────────────────────────────────────

export function ApiKeySection({ projectId }: { projectId: string; }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isOwner = session?.user?.role?.toLowerCase() === 'owner';

  const [docsOpen, setDocsOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copiedNewKey, setCopiedNewKey] = useState(false);

  const { data: project, isLoading } = useQuery<ProjectDetail>({
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

  const copyToClipboard = (key: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(key);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  const currentKey = project?.api_key;

  return (
    <div className="rounded-xl border p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-primary" />
          <div>
            <p className="font-semibold text-sm">API Key del proyecto</p>
            <p className="text-xs text-muted-foreground">
              Úsala en el header{' '}
              <code className="bg-muted px-1 rounded">x-embed-key</code>{' '}
              para acceder al endpoint público de testimonios.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Button size="sm" variant="ghost" onClick={() => setDocsOpen(true)}>
            <BookOpen className="size-3.5 mr-1.5" />
            ¿Cómo usar?
          </Button>
          {isOwner && (
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

      {/* Campo de clave */}
      {isLoading ? (
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
            onClick={() => copyToClipboard(currentKey, setCopiedKey)}
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

      {/* Alerta one-time al generar una nueva clave */}
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
              <Input readOnly value={newKey} className="font-mono text-xs bg-white dark:bg-zinc-900" />
              <Button
                size="sm"
                variant={copiedNewKey ? 'outline' : 'secondary'}
                className={copiedNewKey ? 'border-green-500 text-green-600 shrink-0' : 'shrink-0'}
                onClick={() => copyToClipboard(newKey, setCopiedNewKey)}
              >
                {copiedNewKey ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <ApiKeyDocsDialog open={docsOpen} onOpenChange={setDocsOpen} />
    </div>
  );
}
