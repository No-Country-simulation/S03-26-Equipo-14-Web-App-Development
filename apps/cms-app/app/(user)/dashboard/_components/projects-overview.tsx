'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Skeleton,
} from '@repo/ui/components';
import { Users, FolderOpen } from '@repo/ui/lib';
import apiClient from '@/shared/lib/apiClient';
import { useProjectStore } from '@/store/useProjectStore';
import { Project } from '@/types/testimonials';

function ProjectCard({ project }: { project: Project; }) {
  const { setCurrentProject } = useProjectStore();

  const { data: members, isLoading } = useQuery<{ id: string; }[]>({
    queryKey: ['projectMembers', project.id],
    queryFn: async () => {
      const res = await apiClient.get(`/projects/projectMembers/${project.id}`);
      return res.data.data ?? [];
    },
  });

  return (
    <Card
      className="cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 hover:shadow-md"
      onClick={() => setCurrentProject(project)}
    >
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <FolderOpen className="size-5 text-muted-foreground" />
          <CardTitle className="text-base leading-tight">{project.name}</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Haz clic para abrir el proyecto
        </CardDescription>
      </CardHeader>
      <CardFooter className="">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="size-4" />
          {isLoading ? (
            <Skeleton className="h-4 w-8" />
          ) : (
            <span>
              {members?.length ?? 0}{' '}
              {members?.length === 1 ? 'miembro' : 'miembros'}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export function ProjectsOverview() {
  const { projects } = useProjectStore();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold">Tus proyectos</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Selecciona un proyecto para ver sus testimonios.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
