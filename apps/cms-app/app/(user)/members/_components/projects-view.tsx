'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
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
  Textarea,
  toast,
} from '@repo/ui/components';
import { FolderPlus, Trash2, Users } from '@repo/ui/lib';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession();
  const isOwner = session?.user?.role === 'Owner';
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const queryClient = useQueryClient();

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

  const deleteProject = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/projects/${id}`),
    onSuccess: () => {
      toast.success('Proyecto eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast.error('Error al eliminar el proyecto');
    },
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const createProject = useMutation({
    mutationFn: () =>
      apiClient.post('/projects', {
        name: newProject.name,
        description: newProject.description || undefined,
      }),
    onSuccess: () => {
      toast.success('Proyecto creado correctamente');
      setCreateOpen(false);
      setNewProject({ name: '', description: '' });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast.error('Error al crear el proyecto');
    },
  });

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
      {isOwner && (
        <div className="flex justify-end mb-2">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="size-4 mr-2" />
                Nuevo proyecto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nuevo proyecto</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newProject.name.trim()) {
                    toast.error('El nombre es obligatorio');
                    return;
                  }
                  createProject.mutate();
                }}
                className="flex flex-col gap-4 py-2"
              >
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="proj-name">Nombre</Label>
                  <Input
                    id="proj-name"
                    placeholder="Nombre del proyecto"
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="proj-desc">Descripción (opcional)</Label>
                  <Textarea
                    id="proj-desc"
                    placeholder="Descripción del proyecto"
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <DialogFooter className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createProject.isPending}>
                    {createProject.isPending ? 'Creando...' : 'Crear'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
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
            <CardContent className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleViewMembers(project)}
              >
                <Users className="size-4 mr-2" />
                Ver miembros
              </Button>
              {isOwner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full">
                      <Trash2 className="size-4 mr-2" />
                      Eliminar proyecto
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar "{project.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Se eliminarán permanentemente el proyecto y todos sus
                        testimonios, categorías y etiquetas asociadas. Esta
                        acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProject.mutate(project.id)}
                        disabled={deleteProject.isPending}
                      >
                        {deleteProject.isPending ? 'Eliminando...' : 'Eliminar'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
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
