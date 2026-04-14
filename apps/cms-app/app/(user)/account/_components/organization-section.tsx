'use clinet';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardAction,
  CardContent,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  toast,
  Input,
} from '@repo/ui/components';
import { AlertCircleIcon } from '@repo/ui/lib';
import apiClient from '@/shared/lib/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Organization = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

export function OrganizationSection() {
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const orgId = session?.user?.organizationId;

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['org', orgId, currentUserId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Organization }>(
        `/organization/${orgId}`,
        {
          params: {
            ownerId: currentUserId,
          },
        },
      );
      return res.data.data;
    },
  });

  const form = useForm<Organization>({
    defaultValues: {
      name: data?.name,
    },
    mode: 'onTouched',
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = form;

  const updateOrganization = useMutation({
    mutationFn: (data: Organization) => apiClient.patch(`/organization`, data),
    onSuccess: () => {
      toast.success('Nombre actualizado');
      queryClient.invalidateQueries({ queryKey: ['org'] });
    },
    onError: () => {
      toast.error('Error al actualizar');
    },
  });

  const deleteOrganization = useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/organization/obliterate/${id}`),
    onSuccess: () => {
      toast.success('Organización eliminada');
      // onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast.error('Error al eliminar');
    },
  });

  const onSubmit = async (data: Organization) => {
    setError(null);
    updateOrganization.mutate(data);
  };

  const isDisabled = !isDirty || !isValid || isSubmitting;

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
      });
    }
  }, [data, reset]);

  return (
    <section className="flex flex-col gap-4 h-full">
      <h2 className="text-lg font-semibold truncate">
        Configuracion de proyectos
      </h2>
      <Card>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
              noValidate
            >
              <FormField
                control={control}
                name="name"
                rules={{
                  required: 'El nombre de la organización es obligatorio',
                  minLength: {
                    value: 2,
                    message: 'Debe tener al menos 2 caracteres',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                      Nombre de la organización
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className=""
                        placeholder="ej. EdTechCorp"
                      />
                    </FormControl>
                    <FormMessage className="mt-1.5 text-xs text-red-600" />
                  </FormItem>
                )}
              />
              {error && (
                <Alert
                  variant="destructive"
                  className="max-w-md bg-red-50 border border-red-200"
                >
                  <AlertCircleIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit */}
              <div className="flex gap-2 justify-end">
                <Button className="w-fit" type="submit" disabled={isDisabled}>
                  Guardar nuevo nombre
                </Button>
                <Button
                  variant="secondary"
                  className="w-fit"
                  type="button"
                  onClick={() => {
                    reset();
                    setError(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full border border-red-500">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center text-destructive">
            <AlertCircleIcon /> Eliminar organización
          </CardTitle>
          <CardDescription>
            Esta acción es irreversible, una vez eliminada, se borrarán
            permanentemente todos los datos, miembros y configuraciones
            asociadas sin posibilidad de recuperación.
          </CardDescription>
          <CardAction className="flex  items-center justify-center flex-1">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" variant="destructive">
                  Eliminar organización
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Eliminar la organización &quot;{data?.name}&quot;?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => deleteOrganization.mutate(orgId)}
                    disabled={deleteOrganization.isPending}
                  >
                    {deleteOrganization.isPending
                      ? 'Eliminando...'
                      : 'Eliminar'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardAction>
        </CardHeader>
      </Card>
    </section>
  );
}
