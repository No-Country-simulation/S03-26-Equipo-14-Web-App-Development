'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseFileUploadOptions {
  maxSizeMB?: number;
}

export function useFileUpload({ maxSizeMB }: UseFileUploadOptions = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (newFile: File | null) => {
      if (!newFile) {
        setFile(null);
        setPreview(null);
        return;
      }
      if (maxSizeMB && newFile.size > maxSizeMB * 1024 * 1024) {
        return;
      }
      setFile(newFile);
      if (newFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(newFile));
      } else {
        setPreview(null);
      }
    },
    [maxSizeMB],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const clear = useCallback(() => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return {
    file,
    preview,
    isDragging,
    inputRef,
    handleFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    clear,
  };
}
