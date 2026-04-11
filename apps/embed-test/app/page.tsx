import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
} from "@repo/ui/components";

interface Testimonial {
  id: string;
  type: "text" | "video" | "audio";
  title?: string;
  content?: string;
  author: string;
  author_photo?: string;
  author_role?: string;
  media_url?: string;
  media_description?: string;
  rating?: number | null;
  published_at?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const EMBED_API_KEY = process.env.EMBED_API_KEY ?? "";

async function getTestimonials(): Promise<Testimonial[]> {
  if (!EMBED_API_KEY) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/embed`, {
      headers: { "x-embed-key": EMBED_API_KEY },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? []);
  } catch {
    return [];
  }
}

function StarRating({ rating }: { rating: number; }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex gap-0.5" aria-label={`${rounded} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-4 h-4 ${i < rounded ? "text-amber-400" : "text-muted-foreground/25"}`}
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial; }) {
  const initials = t.author
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const youtubeId =
    t.type === "video" && t.media_url
      ? (t.media_url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
      )?.[1] ?? null)
      : null;

  return (
    <Card className="flex flex-col h-full bg-card border border-border/60 hover:border-border transition-colors duration-200 hover:shadow-md">
      <CardContent className="flex flex-col gap-4 py-6 px-5 h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-primary/40 shrink-0"
        >
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
        </svg>

        {t.title && (
          <p className="font-semibold text-foreground text-sm leading-snug">
            {t.title}
          </p>
        )}

        {t.content && (
          <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-5">
            {t.content}
          </p>
        )}

        {youtubeId && (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title={t.media_description ?? "Video testimonial"}
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9">
              {t.author_photo && (
                <AvatarImage src={t.author_photo} alt={t.author} />
              )}
              <AvatarFallback className="text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {t.author}
              </p>
              {t.author_role && (
                <p className="text-xs text-muted-foreground truncate">
                  {t.author_role}
                </p>
              )}
            </div>
          </div>
          {t.rating != null && <StarRating rating={Number(t.rating)} />}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function LandingPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-50 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-primary-foreground"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="font-semibold text-sm">AcmeCorp</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Producto</a>
            <a href="#" className="hover:text-foreground transition-colors">Precios</a>
            <a href="#" className="hover:text-foreground transition-colors">Blog</a>
          </div>
          <button className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Empezar gratis
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 text-center">
        <div className="max-w-3xl mx-auto space-y-5">
          <Badge variant="secondary" className="text-xs px-3 py-1">
            +{testimonials.length > 0 ? testimonials.length : "500"} clientes satisfechos
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-tight">
            La plataforma que impulsa tu{" "}
            <span className="text-primary">crecimiento</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Miles de equipos confían en nosotros para gestionar sus proyectos y
            alcanzar sus objetivos más rápido.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Comenzar ahora — es gratis
            </button>
            <button className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors text-sm">
              Ver demo
            </button>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-muted-foreground text-sm">
              Historias reales de personas que ya transformaron su forma de trabajar.
            </p>
          </div>

          {testimonials.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {testimonials.map((t) => (
                <div key={t.id} className="break-inside-avoid">
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-16">
              No hay testimonios publicados aún.
            </p>
          )}
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-border bg-muted/40 px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-3xl font-bold text-foreground">¿Listo para empezar?</h2>
          <p className="text-muted-foreground">
            Únete a miles de equipos que ya utilizan AcmeCorp. Sin tarjeta de crédito.
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Crear cuenta gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AcmeCorp · Todos los derechos reservados
      </footer>
    </div>
  );
}
