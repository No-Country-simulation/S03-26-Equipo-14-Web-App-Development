'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components';
import { Users } from '@repo/ui/lib';

type Project = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
};

type ProjectMember = {
  id: string;
  organization_member_id: string;
  project_id: string;
  user_id: string;
  created_at: string;
};

export function ProjectsView() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Project[]; }>('/projects');
      return res.data.data;
    },
  });

  const {
    data: projectMembers = [],
    isLoading: loadingMembers,
    isError: membersError,
  } = useQuery({
    queryKey: ['project-members', selectedProject?.id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: ProjectMember[]; }>(
        `/projects/projectMembers/${selectedProject!.id}`,
      );
      return res.data.data;
    },
    enabled: !!selectedProject?.id && sheetOpen,
    retry: false,
  });

  const handleViewMembers = (project: Project) => {
    setSelectedProject(project);
    setSheetOpen(true);
  };

  if (loadingProjects) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay proyectos en esta organización.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{project.name}</CardTitle>
              {project.description && (
                <CardDescription className="text-xs line-clamp-2">
                  {project.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleViewMembers(project)}
              >
                <Users className="size-4 mr-2" />
                Ver miembros
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Miembros de {selectedProject?.name}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {loadingMembers ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : membersError || projectMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay miembros asignados a este proyecto.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID de usuario</TableHead>
                    <TableHead>Asignado desde</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectMembers.map((pm) => (
                    <TableRow key={pm.id}>
                      <TableCell className="font-mono text-xs">
                        {pm.user_id}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(pm.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
