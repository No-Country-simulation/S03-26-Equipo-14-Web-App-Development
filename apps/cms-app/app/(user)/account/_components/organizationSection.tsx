'use clinet';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  AlertDescription,
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

type NewOrganizationName = {
  organizationName: string;
};

export function OrganizationSection() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<NewOrganizationName>({
    defaultValues: {
      organizationName: '',
    },
    mode: 'onTouched',
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: NewOrganizationName) {
    setError(null);

    try {
      console.log('ok');
      toast.success('Nombre cambiado correctamente');
    } catch (err) {
      console.error(err);
    }
  }

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
                name="organizationName"
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
                <Button className="w-fit" type="submit" disabled={isSubmitting}>
                  Guardar nuevo nombre
                </Button>
                <Button variant="secondary" className="w-fit" type="submit">
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
            <Button size="lg" variant="destructive">
              Eliminar organización
            </Button>
          </CardAction>
        </CardHeader>
      </Card>
    </section>
  );
}
