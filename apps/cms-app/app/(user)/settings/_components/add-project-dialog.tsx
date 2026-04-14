'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Textarea,
  toast,
} from '@repo/ui/components';
import { FolderPlus } from '@repo/ui/lib';
import type { Project } from './table';

export function AddProjectDialog() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<Project>({
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onTouched',
  });

  const { control, handleSubmit, reset, formState } = form;

  const createProject = useMutation({
    mutationFn: (data: Project) =>
      apiClient.post('/projects', {
        name: data.name,
        description: data.description || undefined,
      }),
    onSuccess: () => {
      toast.success('Proyecto creado correctamente');
      setOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast.error('Error al crear el proyecto');
    },
  });

  const onSubmit = (data: Project) => {
    createProject.mutate(data);
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 py-2"
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
                    <Input placeholder="Nombre del proyecto" {...field} />
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
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del proyecto"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={!formState.isValid || createProject.isPending}
              >
                {createProject.isPending ? 'Creando...' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
