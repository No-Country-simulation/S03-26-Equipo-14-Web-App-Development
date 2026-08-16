'use client';

import apiClient from '@/shared/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';

interface Testimonial {
  id: string;
  type: 'quote' | 'case' | 'video';
  title?: string;
  content?: string;
  author: string;
  author_photo?: string;
  author_role?: string;
  media_url?: string;
  media_description?: string;
  rating?: number | null;
  project_id?: string;
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
          className={`w-4 h-4 ${i < rounded ? 'text-amber-400' : 'text-muted-foreground/25'}`}
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialWidget({ t }: { t: Testimonial; }) {
  const initials = t.author
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const youtubeId =
    t.type === 'video' && t.media_url
      ? (t.media_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1] ?? null)
      : null;
  return (
    <div className="flex flex-col gap-4 bg-card text-card-foreground border border-border/60 rounded-xl shadow-sm w-full h-full p-4">
      {/* Quote icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 text-primary/40 shrink-0"
      >
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
      </svg>

      {t.title && (
        <p className="font-semibold text-foreground text-sm leading-snug">{t.title}</p>
      )}

      {t.content && (
        <p className="text-sm text-muted-foreground leading-relaxed">{t.content}</p>
      )}

      {youtubeId && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={t.media_description ?? 'Video testimonial'}
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
        <div className="flex items-center gap-3">
          {t.author_photo ? (
            <img
              src={t.author_photo}
              alt={t.author}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{t.author}</p>
            {t.author_role && (
              <p className="text-xs text-muted-foreground truncate">{t.author_role}</p>
            )}
          </div>
        </div>
        {t.rating != null && <StarRating rating={Number(t.rating)} />}
      </div>

      {t.project_id && (
        <a
          href={`/testimonial-visitor/${t.project_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center justify-center gap-1.5 w-full rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-medium py-2 px-3 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Deja tu testimonio
        </a>
      )}
    </div>
  );
}

export default function Page() {
  const { id } = useParams() as { id: string; };
  const searchParams = useSearchParams();
  const theme = searchParams.get('theme');
  const isDark = theme === 'dark';

  const { data: testimonial, isLoading, isError } = useQuery({
    queryKey: ['testimonialEmbed', id],
    queryFn: async () => {
      const res = await apiClient.get(`/testimonials/public/getById/${id}`);
      return res.data.data as Testimonial;
    },
  });

  return (
    <div className={`min-h-screen flex ${isDark ? 'dark' : ''}`}>
      <div className="absolute top-0 left-0 w-full h-full">
        {isLoading && (
          <div className="flex gap-2 items-center text-muted-foreground text-sm">
            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Cargando testimonio…
          </div>
        )}
        {(isError || (!isLoading && !testimonial)) && (
          <p className="text-sm text-muted-foreground">No se pudo cargar el testimonio.</p>
        )}
        {testimonial && <TestimonialWidget t={testimonial} />}
      </div>
    </div>
  );
}
