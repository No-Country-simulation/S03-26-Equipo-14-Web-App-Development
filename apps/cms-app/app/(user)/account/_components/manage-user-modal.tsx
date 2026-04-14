'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import apiClient from '@/shared/lib/apiClient';
import {
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from '@repo/ui/components';
// import { MultiSelect } from '../../_components/multiselect';
// import type { Option } from '../../_components/multiselect';
import type { Member } from './table';
import { RemoveMemberDialog } from './remove-member-dialog';

// interface Project {
//   id: string;
//   name: string;
// }

interface FormValues {
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor';
  projectId: string;
  // projects: string[];
}

export function ManageUserModal({
  open,
  onOpenChange,
  member,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onSuccess: () => void;
}) {
  const { data: session } = useSession();

  const form = useForm<FormValues>({
    defaultValues: {
      name: member?.name,
      email: member?.email,
      role: member?.role,
      projectId: '',
      // projects: [],
    },
    mode: 'onTouched',
  });

  const { control, handleSubmit, reset, formState } = form;
  const orgId = session?.user?.organizationId;

  // const { data: projects = [] } = useQuery({
  //   queryKey: ['projects'],
  //   queryFn: async () => {
  //     const res = await apiClient.get<{ data: Project[] }>('/projects');
  //     return res.data.data;
  //   },
  //   enabled: open,
  // });

  // const projectsCleanData: Option[] = projects.map((p) => {
  //   return {
  //     label: p.name,
  //     value: p.id,
  //   };
  // });

  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['org-members', orgId] });
  };

  const roleMutation = useMutation({
    mutationFn: (data: FormValues) =>
      apiClient.patch(`/organization/member/role/${member?.userId}`, {
        role: data.role,
      }),
    onSuccess: () => {
      toast.success('Rol actualizado correctamente');
      onOpenChange(false);
      reset();
      handleRefresh();
    },
    onError: () => {
      toast.error('Error al cambiar el rol');
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!member?.userId) {
      return;
    }
    roleMutation.mutate(data);
  };

  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
        email: member.email,
        role: member.role === 'Owner' ? 'Admin' : member.role,
        projectId: '',
      });
    }
  }, [member, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestionar miembro</DialogTitle>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              disabled
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
            {/* <FormField
              control={control}
              name="projectId"
              // name="projects"
              rules={{ required: 'Seleccione un proyecto' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proyecto</FormLabel> */}
            {/* <MultiSelect
                    options={projectsCleanData}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Selecciona proyectos"
                  /> */}
            {/* <Select onValueChange={field.onChange} value={field.value}>
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
            /> */}

            {member && (
              <RemoveMemberDialog
                memberId={member.id}
                userId={member.userId}
                memberName={member.name}
                onSuccess={() => {
                  onSuccess();
                  onOpenChange(false);
                }}
              />
            )}
            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={!formState.isValid || roleMutation.isPending}
              >
                {roleMutation.isPending ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
