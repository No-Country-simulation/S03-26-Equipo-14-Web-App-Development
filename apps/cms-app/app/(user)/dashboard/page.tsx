'use client';

// import { ErrorMessage } from './_components/error-message';
import { EmptyDashboard } from './_components/empty-dashboard';
import { NoProjects } from './_components/no-projects';
import { Loading } from './_components/loading';
import { DashboardView } from './_components/dashboard-view';
import { useProjectStore } from '@/store/useProjectStore';
import { testimonials } from '@/data/testimonials';
import { TestimonialModal } from './_components/testimonial-modal';
import { useState } from 'react';
import { Testimonial } from '@/types/testimonials';
import { toast } from '@repo/ui/components';

export default function DashboardPage() {
  const { projects } = useProjectStore();

  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (t: Testimonial) => {
    setSelected(t);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    // await deleteTestimonial(id);
    setOpen(false);
    setSelected(null);
    toast.success('Eliminado correctamente');
  };

  let content = <Loading />;

  if (projects.length === 0) {
    content = <NoProjects />;
  } else if (testimonials.length === 0) {
    content = <EmptyDashboard />;
  } else {
    content = (
      <DashboardView testimonials={testimonials} onSelect={handleOpen} />
    );
  }

  return (
    <>
      <TestimonialModal
        open={open}
        onOpenChange={setOpen}
        testimonial={selected}
        onDelete={handleDelete}
      />
      <section className="flex flex-col gap-4 h-full">{content}</section>
    </>
  );
}
