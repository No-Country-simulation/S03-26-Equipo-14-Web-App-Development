'use client';

import { NoProjects } from './_components/no-projects';
import { DashboardView } from './_components/dashboard-view';
import { ProjectsOverview } from './_components/projects-overview';
import { useProjectStore } from '@/store/useProjectStore';
import { TestimonialModal } from './_components/testimonial-modal';
import { useMemo, useState } from 'react';
import { Testimonial } from '@/types/testimonials';
import { toast } from '@repo/ui/components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import { type Filters } from './_components/filtersbar';
import { useSession } from 'next-auth/react';

const DEFAULT_FILTERS: Filters = {
  search: '',
  type: '',
  status: '',
  sorted: 'newest',
  categoryId: '',
  tagId: '',
  layout: 'grid',
};

export default function DashboardPage() {
  const { projects, currentProject } = useProjectStore();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const { data: rawTestimonials = [], isLoading, isFetching } = useQuery<Testimonial[]>({
    queryKey: ['testimonials', currentProject?.id, filters.search, filters.type, filters.sorted, filters.categoryId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.set('fragment', filters.search);
      if (filters.type) params.set('type', filters.type);
      if (filters.sorted) params.set('sorted', filters.sorted === 'newest' ? 'created_at:desc' : 'created_at:asc');
      if (filters.categoryId) params.set('category_id', filters.categoryId);
      const r = await apiClient.get(`/testimonials/${currentProject!.id}?${params}`);
      return r.data.data ?? [];
    },
    enabled: !!currentProject?.id,
  });

  const { data: categories = [] } = useQuery<{ id: string; name: string; }[]>({
    queryKey: ['categories', currentProject?.id],
    queryFn: async () => {
      const r = await apiClient.get(`/categories/${currentProject!.id}`);
      return r.data.data ?? [];
    },
    enabled: !!currentProject?.id,
  });

  const { data: tags = [] } = useQuery<{ id: string; name: string; }[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const r = await apiClient.get('/tag');
      return r.data.data ?? [];
    },
    enabled: !!currentProject?.id,
  });

  // status y tagId son filtros client-side (sin param de API)
  const testimonials = useMemo(() => {
    let result = rawTestimonials;
    if (filters.status) result = result.filter((t) => t.status === filters.status);
    if (filters.tagId) result = result.filter((t) => t.tags?.some((tag: { id: string; }) => tag.id === filters.tagId));
    return result;
  }, [rawTestimonials, filters.status, filters.tagId]);

  const handleOpen = (t: Testimonial) => { setSelected(t); setOpen(true); };
  const handleClose = () => { setOpen(false); setSelected(null); };

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, type, status, rejectedReason }: { id: string; type: string; status: string; rejectedReason?: string; }) =>
      apiClient.patch(`/testimonials/changeStatus/${id}`, { type, status, ...(rejectedReason ? { rejectedReason } : {}) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials', currentProject?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/testimonials/${id}`, { data: { userId: session?.user?.id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials', currentProject?.id] });
    },
  });

  const handleDelete = (id: string) => {
    toast.promise(
      deleteMutation.mutateAsync(id).then(() => handleClose()),
      { loading: 'Eliminando...', success: 'Testimonio eliminado con éxito', error: 'Error al eliminar el testimonio' },
    );
  };

  const handlePublish = (id: string) => {
    if (!selected) return;
    const status = selected.type === 'quote' && selected.status === 'pending' ? 'review' : 'published';
    const label = selected.type === 'quote' && selected.status === 'pending' ? 'Testimonio aprobado' : 'Testimonio publicado';
    toast.promise(
      changeStatusMutation.mutateAsync({ id, type: selected.type, status }).then(() => handleClose()),
      { loading: 'Actualizando...', success: label, error: 'Error al actualizar el estado' },
    );
  };

  const handleReject = (id: string, reason: string) => {
    if (!selected) return;
    toast.promise(
      changeStatusMutation.mutateAsync({ id, type: selected.type, status: 'rejected', rejectedReason: reason || undefined }).then(() => handleClose()),
      { loading: 'Actualizando...', success: 'Testimonio rechazado', error: 'Error al actualizar el estado' },
    );
  };

  let content;

  if (projects.length === 0) {
    content = <NoProjects />;
  } else if (!currentProject) {
    content = <ProjectsOverview />;
  } else {
    content = (
      <DashboardView
        testimonials={testimonials}
        categories={categories}
        tags={tags}
        filters={filters}
        onFilterChange={setFilter}
        onSelect={handleOpen}
        isListLoading={isFetching}
      />
    );
  }

  return (
    <>
      <TestimonialModal
        open={open}
        onOpenChange={setOpen}
        testimonial={selected}
        onDelete={handleDelete}
        onPublish={handlePublish}
        onReject={handleReject}
      />
      <section className="flex flex-col gap-4 h-full">{content}</section>
    </>
  );
}
