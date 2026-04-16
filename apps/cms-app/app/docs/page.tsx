import { Label, Card } from '@repo/ui/components';
import React from 'react';

const methods = [
  {
    title: 'API Directa (Custom)',
    description: 'Accede a los datos puros vía endpoint para construir tus propias interfaces desde cero con total libertad creativa.',
  },
  {
    title: 'Librería UI (React)',
    description: 'Utiliza nuestro componente de Carousel optimizado, manteniendo el control sobre las propiedades y el rendimiento.',
  },
  {
    title: 'Widget (No-Code)',
    description: 'La forma más rápida. Solo copia y pega un fragmento de código para tener una solución lista para usar.',
  },
];

const Page = () => {
  return (
    <div className="max-w-4xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Guía de Integración</h1>
        <p className="text-lg text-muted-foreground font-light leading-relaxed">
          Bienvenido a nuestra documentación técnica. Aquí encontrarás todo lo necesario para mostrar los datos recopilados en tu propia plataforma, adaptándonos a tu flujo de trabajo y nivel de personalización requerido.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Ofrecemos tres métodos flexibles según tus necesidades:
        </h2>
        <div className="grid gap-4">
          {methods.map((me, idx) => (
            <MethodCard key={idx} title={me.title} description={me.description} />
          ))}
        </div>
      </section>
    </div>
  );
};

const MethodCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-muted-foreground font-light">{description}</p>
    </Card>
  );
};


export default Page;
