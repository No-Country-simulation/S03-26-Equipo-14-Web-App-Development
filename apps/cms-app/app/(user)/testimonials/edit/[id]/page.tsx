'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { TestimonialForm } from '../../_components/testimonial-form';
import apiClient from '@/shared/lib/apiClient';

export default function EditTestimonialPage() {
  const { id } = useParams<{ id: string; }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['testimonial', id],
    queryFn: () =>
      apiClient.get(`/testimonials/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Cargando testimonio...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive text-sm">No se pudo cargar el testimonio.</p>
      </div>
    );
  }

  const defaultValues = {
    author: data.author ?? '',
    authorRole: data.authorRole ?? '',
    title: data.title ?? '',
    content: data.type === 'case' ? (data.content ?? '') : '',
    videoSummary: data.type === 'video' ? (data.content ?? data.mediaDescription ?? '') : '',
    categoryId: data.categoryId ?? '',
    tagIds: (data.tags ?? []).map((t: { id: string; }) => t.id),
    isDraft: data.status === 'draft',
  };

  return (
    <TestimonialForm
      mode="edit"
      testimonialId={id}
      defaultValues={defaultValues}
    />
  );
}
