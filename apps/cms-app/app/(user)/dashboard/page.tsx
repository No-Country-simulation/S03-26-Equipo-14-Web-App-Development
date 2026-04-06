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

export default function DashboardPage() {
  // Para probar cuando no hay proyectos
  // const projects = [];

  // Para probar cuando no hay testimonios
  // const { projects, selectedProjectId } = useProjectStore();
  // const testimonials = [];

  //   const [selected, setSelected] = useState<Testimonial | null>(null);
  //   const [open, setOpen] = useState(false);

  //   const handleOpen = (testimonial: Testimonial) => {
  //     setSelected(testimonial);
  //     setOpen(true);
  //   };

  const { projects } = useProjectStore();

  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (t: Testimonial) => {
    setSelected(t);
    setOpen(true);
  };

  let content = <Loading />; // Estado inicial de carga

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
      />
      <section className="flex flex-col gap-4 h-full">{content}</section>
    </>
  );
}
