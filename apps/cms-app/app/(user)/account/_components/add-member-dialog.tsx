'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import apiClient from '@/shared/lib/apiClient';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from '@repo/ui/components';
import { UserPlus } from '@repo/ui/lib';
import { MultiSelect } from '../../_components/multiselect';
import type { Option } from '../../_components/multiselect';

interface Project {
  id: string;
  name: string;
}

interface FormValues {
  name: string;
  email: string;
  role: 'Admin' | 'Editor';
  projectId: string;
  // projects: string[];
}

interface AddMemberDialogProps {
  onSuccess: () => void;
}

export function AddMemberDialog({ onSuccess }: AddMemberDialogProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      role: 'Editor',
      projectId: '',
      // projects: [],
    },
    mode: 'onTouched',
  });

  const { control, handleSubmit, reset, formState } = form;

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Project[] }>('/projects');
      return res.data.data;
    },
    enabled: open,
  });

  const projectsCleanData: Option[] = projects.map((p) => {
    return {
      label: p.name,
      value: p.id,
    };
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      apiClient.post('/auth/member', {
        ...data,
        organizationId: session?.user?.organizationId,
      }),
    onSuccess: () => {
      toast.success('Usuario agregado correctamente');
      setOpen(false);
      reset();
      onSuccess();
    },
    onError: () => {
      toast.error('Error al agregar usuario');
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    mutation.mutate(data);
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
          <UserPlus className="size-4 mr-2" />
          Agregar miembro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar nuevo miembro</DialogTitle>
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
                    <Input placeholder="Nombre completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={control}
              name="email"
              rules={{
                required: 'El email es obligatorio',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Email inválido',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rol */}
            <FormField
              control={control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Proyecto */}
            <FormField
              control={control}
              name="projectId"
              // name="projects"
              rules={{ required: 'Seleccione un proyecto' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proyecto</FormLabel>
                  {/* <MultiSelect
                    options={projectsCleanData}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Selecciona proyectos"
                  /> */}
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={!formState.isValid || mutation.isPending}
              >
                {mutation.isPending ? 'Agregando...' : 'Agregar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
