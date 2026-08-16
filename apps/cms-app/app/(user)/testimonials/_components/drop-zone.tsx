'use client';

import React from 'react';
import Image from 'next/image';
import { X } from '@repo/ui/lib';

export interface DropZoneProps {
  accept: string;
  maxSizeMB?: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  file: File | null;
  preview: string | null;
  existingUrl?: string;
  isDragging: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (f: File | null) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onClear: () => void;
  isVideo?: boolean;
}

export function DropZone({
  accept,
  icon,
  title,
  subtitle,
  file,
  preview,
  existingUrl,
  isDragging,
  inputRef,
  onFile,
  onDrop,
  onDragOver,
  onDragLeave,
  onClear,
  isVideo = false,
}: DropZoneProps) {
  const getYouTubeId = (url: string) => {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return m ? m[1] : null;
  };
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40'}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />

      {preview && !isVideo ? (
        <>
          <div className="relative w-full aspect-video rounded-md overflow-hidden">
            <Image src={preview} alt="Preview" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-background border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : !file && existingUrl && !isVideo ? (
        <>
          <div className="relative w-full aspect-video rounded-md overflow-hidden">
            <Image src={existingUrl} alt="Imagen existente" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-background border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : file && isVideo ? (
        <>
          <div className="flex flex-col items-center gap-2">
            {icon}
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-background border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : !file && existingUrl && isVideo ? (
        <>
          <div
            className="relative w-full aspect-video rounded-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {getYouTubeId(existingUrl) ? (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeId(existingUrl)}`}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <p className="text-xs text-muted-foreground p-4">{existingUrl}</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Haz clic fuera del video para reemplazarlo</p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-background border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
        </>
      )}
    </div>
  );
}
