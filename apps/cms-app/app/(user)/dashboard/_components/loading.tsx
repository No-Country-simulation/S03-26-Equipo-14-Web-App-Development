import React from 'react';

export function Loading() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="mb-2 h-16 w-16 animate-spin rounded-full border-2 border-indigo-300 border-t-transparent" />

        {/* Labels */}
        <p className="text-[11px] tracking-[0.3em] uppercase">
          CMS DE TESTIMONIOS
        </p>
        <p className="text-2xl font-light text-gray-800">Cargando...</p>
        <p className="text-[10px] tracking-[0.25em] uppercase">
          SINCRONIZANDO DATOS
        </p>
      </div>

      {/* Footer */}
      <p className="absolute bottom-8 text-[10px] tracking-[0.2em] text-gray-400 uppercase">
        EDTECH.CMS
      </p>
    </div>
  );
}
