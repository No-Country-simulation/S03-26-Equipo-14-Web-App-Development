import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components';
import React from 'react';

const Page = () => {
  return (
    <div className="max-w-4xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>
        <p className="text-lg text-muted-foreground font-light">
          Accede a los datos para construir tus propios componentes
          personalizados. Nuestro endpoint principal permite obtener información
          filtrada y estructurada.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50 rounded-xl border">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Endpoint
          </h4>
          <code className="text-lg font-mono font-bold text-primary">
            GET /embed
          </code>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Autenticación
          </h4>
          <p className="text-sm text-muted-foreground">
            Header:{' '}
            <code className="font-bold text-foreground">x-embed-key</code>
          </p>
          <p className="text-sm text-muted-foreground">
            Valor:{' '}
            <span className="italic text-foreground font-medium">
              Tu API KEY generada
            </span>
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Parámetros de consulta</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[150px]">Parámetro</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Requerido</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono font-medium">type</TableCell>
                <TableCell>string</TableCell>
                <TableCell>No</TableCell>
                <TableCell className="text-muted-foreground">
                  Filtra el contenido. Valores:{' '}
                  <code className="text-xs bg-slate-100 px-1 italic">
                    quote, case, video
                  </code>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Ejemplo de Implementación</h2>
          <p className="text-muted-foreground font-light">
            Fragmento de código en React para testear la conexión desde tu
            aplicación.
          </p>
        </div>

        <div className="relative group w-full">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-gray-700 rounded-t-lg">
            <span className="text-xs font-mono text-gray-400">
              React / TypeScript
            </span>
            <button className="text-xs text-gray-400 hover:text-white transition-colors">
              Copy code
            </button>
          </div>

          <pre className="overflow-x-auto p-4 bg-[#1e1e1e] text-gray-300 font-mono text-sm leading-relaxed rounded-b-lg shadow-xl">
            <code className="block">
              <span className="text-purple-400">useEffect</span>(() =&gt; {'{'}{' '}
              {'\n'}
              {'  '}const <span className="text-blue-400">testFetch</span> ={' '}
              <span className="text-purple-400">async</span> () =&gt; {'{'}{' '}
              {'\n'}
              {'    '}const <span className="text-blue-300">result</span> ={' '}
              <span className="text-purple-400">await</span>{' '}
              <span className="text-yellow-200">fetch</span>( {'\n'}
              {'      '}
              <span className="text-green-400">"https://onrender.com"</span>,
              {'\n'}
              {'      '}
              {'{'} {'\n'}
              {'        '}method: <span className="text-green-400">"GET"</span>,
              {'\n'}
              {'        '}headers: {'{'} {'\n'}
              {'          '}
              <span className="text-orange-300">'x-embed-key'</span>:{' '}
              <span className="text-green-400">'TU_API_KEY_AQUI'</span> {'\n'}
              {'        '}
              {'}'} {'\n'}
              {'      '}
              {'}'} {'\n'}
              {'    '});{'\n'}
              {'\n'}
              {'    '}console.<span className="text-yellow-200">log</span>
              (result);{'\n'}
              {'  '}
              {'}'};{'\n'}
              {'\n'}
              {'  '}
              <span className="text-yellow-200">testFetch</span>();{'\n'}
              {'}'}, []);
            </code>
          </pre>
        </div>
      </section>
    </div>
  );
};

export default Page;
