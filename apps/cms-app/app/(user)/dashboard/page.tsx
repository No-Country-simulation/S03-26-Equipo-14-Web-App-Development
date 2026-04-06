'use client';

// import { ErrorMessage } from './_components/error-message';
import { EmptyDashboard } from './_components/empty-dashboard';
import { NoProjects } from './_components/no-projects';
import { Loading } from './_components/loading';
import { DashboardView } from './_components/dashboard-view';
import { useProjectStore } from '@/store/useProjectStore';
import { testimonials } from '@/store/useProjectStore';

export default function DashboardPage() {
  // Para probar cuando no hay proyectos
  // const projects = [];

  // Para probar cuando no hay testimonios
  // const { projects, selectedProjectId } = useProjectStore();
  // const testimonials = [];

  const { projects, selectedProjectId } = useProjectStore();

  let content = <Loading />; // Estado inicial de carga

  if (projects.length === 0) {
    content = <NoProjects />;
  } else if (testimonials.length === 0) {
    content = <EmptyDashboard />;
  } else {
    content = <DashboardView testimonials={testimonials} />;
  }

  return <section className="flex flex-col gap-4 h-full">{content}</section>;
}
