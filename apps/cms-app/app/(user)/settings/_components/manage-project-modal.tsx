'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Separator,
  Textarea,
  toast,
} from '@repo/ui/components';
import type { Project } from './table';
import { useQuery } from '@tanstack/react-query';
import { X } from '@repo/ui/lib';

interface ProjectFormValues {
  name: string;
  description: string;
  categoryId: string;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
}

export function ManageProjectModal({
  open,
  onOpenChange,
  project,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}) {
  const [newCategoryName, setNewCategoryName] = useState('');

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      name: project?.name,
      description: project?.description,
    },
    mode: 'onTouched',
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories', project?.id],
    queryFn: async () => {
      const res = await apiClient.get(`/categories/${project!.id}`);
      return res.data.data ?? res.data;
    },
    enabled: open && !!project?.id,
  });

  const { control, handleSubmit, reset, formState } = form;

  const queryClient = useQueryClient();

  const updateProject = useMutation({
    mutationFn: (data: ProjectFormValues) =>
      apiClient.patch(`/projects/${project?.id}`, data),
    onSuccess: () => {
      toast.success('Proyecto actualizado');
      onOpenChange(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast.error('Error al actualizar');
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/projects/${id}`),
    onSuccess: () => {
      toast.success('Proyecto eliminado');
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast.error('Error al eliminar');
    },
  });

  const createCategory = useMutation({
    mutationFn: (name: string) =>
      apiClient.post(`/categories/${project?.id}`, { name }),
    onSuccess: () => {
      toast.success('Categoría creada');
      setNewCategoryName('');
      queryClient.invalidateQueries({ queryKey: ['categories', project?.id] });
    },
    onError: () => {
      toast.error('Error al crear categoría');
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (categoryId: string) =>
      apiClient.delete(`/categories/${project?.id}/${categoryId}`),
    onSuccess: () => {
      toast.success('Categoría eliminada');
      queryClient.invalidateQueries({ queryKey: ['categories', project?.id] });
    },
    onError: () => {
      toast.error('Error al eliminar categoría');
    },
  });

  const onSubmit = (data: ProjectFormValues) => {
    if (!project?.id) return;
    updateProject.mutate(data);
  };

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description ?? '',
      });
    }
  }, [project, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestionar proyecto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Nombre */}
            <FormField
              control={control}
              name="name"
              rules={{ required: 'El nombre es obligatorio' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            {/* Categorías */}
            <div className="flex flex-col gap-2">
              <FormLabel>Categorías</FormLabel>

              {/* Lista de categorías existentes */}
              {categoriesLoading ? (
                <p className="text-sm text-muted-foreground">Cargando categorías...</p>
              ) : categoriesData && categoriesData.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {categoriesData.map((cat) => (
                    <Badge key={cat.id} variant="secondary" className="flex items-center gap-1 pr-1">
                      {cat.name}
                      <button
                        type="button"
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                        disabled={deleteCategory.isPending}
                        onClick={() => deleteCategory.mutate(cat.id)}
                        aria-label={`Eliminar categoría ${cat.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay categorías creadas para este proyecto.
                </p>
              )}

              {/* Nueva categoría */}
              <div className="flex gap-2">
                <Input
                  placeholder="Nueva categoría"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newCategoryName.trim()) {
                        createCategory.mutate(newCategoryName.trim());
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={!newCategoryName.trim() || createCategory.isPending}
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      createCategory.mutate(newCategoryName.trim());
                    }
                  }}
                >
                  {createCategory.isPending ? 'Creando...' : 'Agregar'}
                </Button>
              </div>
            </div>

            <Separator />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deleteProject.isPending}
                >
                  Eliminar proyecto
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Eliminar el proyecto &ldquo;{project?.name}&rdquo;?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Se eliminarán permanentemente el proyecto y todos sus
                    testimonios, categorías y etiquetas asociadas. Esta acción
                    no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (!project) {
                        return;
                      }
                      deleteProject.mutate(project.id);
                    }}
                    disabled={deleteProject.isPending}
                  >
                    {deleteProject.isPending ? 'Eliminando...' : 'Eliminar'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Footer */}
            <DialogFooter className="flex ">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={!formState.isValid || updateProject.isPending}
              >
                {updateProject.isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
