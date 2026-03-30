import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Icono de exclamación */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-indigo-300 text-indigo-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Número 404 */}
        <h1 className="text-8xl font-bold text-gray-700 leading-none">404</h1>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-700">Página no encontrada</h2>

        {/* Descripción */}
        <p className="text-gray-500 max-w-sm">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        {/* Botón */}
        <Link
          href="/dashboard"
          className="mt-2 inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-md transition-colors"
        >
          Volver al Dashboard
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </Link>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-xs text-gray-400 tracking-widest uppercase">
        EdTech CMS &bull; Gestión de Testimonios &bull; 2024
      </footer>
    </div>
  );
}
