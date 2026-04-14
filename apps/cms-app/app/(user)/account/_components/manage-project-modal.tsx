'use client';

import { useEffect } from 'react';
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
  Textarea,
  toast,
} from '@repo/ui/components';
import type { Project } from './table';

interface ProjectFormValues {
  name: string;
  description: string;
  categoryId: string;
  tags: string[];
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
  const form = useForm<ProjectFormValues>({
    defaultValues: {
      name: project?.name,
      description: project?.description,
      // categoryId: project?.category,
      // tags: project?.tags,
    },
    mode: 'onTouched',
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

  const onSubmit = (data: ProjectFormValues) => {
    if (!project?.id) return;
    updateProject.mutate(data);
  };

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description ?? '',
        // categoryId: project.categoryId ?? '',
        // tags: project.tags?.map((t) => t.id) ?? [],
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

            {/* Categoría */}
            {/* <FormField
      control={control}
      name="categoryId"
      rules={{ required: 'Seleccione una categoría' }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categoría</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    /> */}

            {/* Tags */}
            {/* <FormField
      control={control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <MultiSelect
            options={tagsOptions}
            value={field.value}
            onChange={field.onChange}
            placeholder="Selecciona tags"
          />
        </FormItem>
      )}
    /> */}
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
                    ¿Eliminar el proyecto "{project?.name}"?
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
                    onClick={() => deleteProject.mutate(project.id)}
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
