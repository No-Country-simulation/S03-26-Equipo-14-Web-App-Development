import Link from "next/link";
import { BookOpen } from "@repo/ui/lib";
import { LandingFooter } from "@/app/(landing)/_components/landing-footer";
import { TestimonialForm } from "./_components/testimonial-form";

interface TestimonialPageProps {
  params: Promise<{ id: string; }>;
}

export default async function TestimonialPage({ params }: TestimonialPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header: solo logo */}
      <header className="border-b border-border bg-card sticky top-0 z-50 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <BookOpen className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-sm">
              Geist EdTech
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-12">
        {/* encabezado */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Comparte tu experiencia
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Tu opinión ayuda a otros estudiantes a tomar la mejor decisión
          </p>
        </div>

        {/* tarjeta del formulario */}
        <div className="w-full max-w-lg bg-card rounded-2xl shadow-sm border-0 overflow-hidden">
          <TestimonialForm testimonialId={id} />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
