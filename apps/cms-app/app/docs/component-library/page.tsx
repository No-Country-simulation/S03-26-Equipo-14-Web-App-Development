import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@repo/ui/components';
import React from 'react';

const Page = () => {
  return (
    <div className="max-w-4xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Componentes UI</h1>
        <p className="text-lg text-muted-foreground font-light">
          Utiliza nuestra librería oficial de React para integrar componentes de
          alto rendimiento con estilos preconfigurados y soporte nativo para
          TypeScript.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Instalación</h2>
        <p className="text-muted-foreground font-light">
          Añade la librería a tu proyecto utilizando tu gestor de paquetes
          preferido:
        </p>
        <div className="relative group">
          <pre className="p-4 bg-[#1e1e1e] text-green-400 font-mono text-sm rounded-lg shadow-inner">
            <code>npm install @team14/cms-library</code>
          </pre>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Uso Básico</h2>
        <p className="text-muted-foreground font-light">
          Importa el componente y pasa tu API Key para empezar a mostrar
          contenido:
        </p>

        <div className="relative group w-full">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-700 rounded-t-lg">
            <span className="text-xs font-mono text-gray-400">Example.tsx</span>
          </div>
          <pre className="overflow-x-auto p-4 bg-[#1e1e1e] text-gray-300 font-mono text-sm leading-relaxed rounded-b-lg shadow-xl">
            <code>
              <span className="text-gray-500">// Importar estilos (Obligatorio)</span>{"\n"}
              <span className="text-purple-400">import</span> <span className="text-green-400">"@team14/cms-library/dist/style.css"</span>;{"\n"}
              <span className="text-purple-400">import</span> {'{'}{' '}
              <span className="text-blue-300">TestimonialCarrousel</span> {'}'}{' '}
              <span className="text-purple-400">from</span>{' '}
              <span className="text-green-400">"@team14/cms-library"</span>;
              {'\n\n'}
              <span className="text-purple-400">const</span>{' '}
              <span className="text-yellow-200">App</span> = () =&gt; ({'\n'}
              {'  '}&lt;
              <span className="text-blue-300">TeastimonialCarousel</span> {'\n'}
              {'    '}apiKey=
              <span className="text-green-400">"TU_API_KEY"</span>{' '}
              <span>//requerido</span> {'\n'}
              {'    '}type=<span className="text-green-400">"video"</span>{' '}
              <span>//opcional</span>
              {'\n'}
              {'  '}/&gt;{'\n'}
              );
            </code>
          </pre>
        </div>
      </section>

      {/* Propiedades (Props) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Propiedades (Props)</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Prop</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono font-medium">apiKey</TableCell>
                <TableCell className="text-blue-600">string</TableCell>
                <TableCell className="italic text-slate-400">
                  required
                </TableCell>
                <TableCell className="text-muted-foreground">
                  Tu clave x-embed-key para autenticar.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono font-medium">type</TableCell>
                <TableCell className="text-blue-600">
                  "quote" | "case" | "video"
                </TableCell>
                <TableCell className="font-mono text-xs">opcional</TableCell>
                <TableCell className="text-muted-foreground">
                  Define el tipo de datos a renderizar.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono font-medium">
                  className
                </TableCell>
                <TableCell className="text-blue-600">string</TableCell>
                <TableCell className="font-mono text-xs">opcional</TableCell>
                <TableCell className="text-muted-foreground">
                  String de clases tailwind
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono font-medium">length</TableCell>
                <TableCell className="text-blue-600">number</TableCell>
                <TableCell className="font-mono text-xs">2</TableCell>
                <TableCell className="text-muted-foreground">
                  Longitud de testimonios visibles
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default Page;
