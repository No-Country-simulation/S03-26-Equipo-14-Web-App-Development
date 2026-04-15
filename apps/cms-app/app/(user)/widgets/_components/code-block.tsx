'use client';

import { Check, Copy } from '@repo/ui/lib';

interface CodeBlockProps {
  id: string;
  code: string;
  copied: Record<string, boolean>;
  onCopy: (id: string, text: string) => void;
}

export function CodeBlock({ id, code, copied, onCopy }: CodeBlockProps) {
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
        {copied[id] ? (
          <Check className="size-3.5 text-green-500" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
    </div>
  );
}
