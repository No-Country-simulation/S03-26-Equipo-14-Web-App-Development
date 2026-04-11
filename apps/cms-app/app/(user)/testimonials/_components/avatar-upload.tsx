'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui';
import { Camera, X } from '@repo/ui/lib';

export interface AvatarUploadProps {
  preview: string | null;
  existingUrl?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (f: File | null) => void;
  onClear: () => void;
}

export function AvatarUpload({ preview, existingUrl, inputRef, onFile, onClear }: AvatarUploadProps) {
  const displaySrc = preview ?? existingUrl ?? undefined;
  return (
    <div className="flex items-center gap-4 rounded-lg border border-dashed border-border p-4">
      <div
        className="relative cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        <Avatar className="size-16 rounded-lg">
          <AvatarImage src={displaySrc} alt="Avatar" className="object-cover" />
          <AvatarFallback className="rounded-lg bg-muted">
            <Camera className="w-6 h-6 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        {displaySrc && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-background border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <div>
        <p className="text-sm font-medium">Subir foto de perfil</p>
        <p className="text-xs text-muted-foreground">PNG, JPG hasta 5MB</p>
      </div>
    </div>
  );
}
