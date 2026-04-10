'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  AlertDescription,
  Card,
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/components';
import { AlertCircleIcon, Plus } from '@repo/ui/lib';
import { MultiSelect } from '../../_components/multiselect';

type NewUserFormValues = {
  userName: string;
  userEmail: string;
  userRole: string;
  projects: string[] | undefined;
};

const projects = [
  { label: 'Proyecto A', value: 'a' },
  { label: 'Proyecto B', value: 'b' },
  { label: 'Proyecto C', value: 'c' },
];

export function AddUsersForm() {
  const [cardVisibility, setCardVisibility] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<NewUserFormValues>({
    defaultValues: {
      userName: '',
      userEmail: '',
      userRole: '',
      projects: [],
    },
    mode: 'onTouched',
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: NewUserFormValues) {
    setError(null);

    try {
      console.log('ok');
      toast.success('Usuario creado correctamente');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          className="w-fit"
          onClick={() => setCardVisibility(!cardVisibility)}
        >
          <Plus /> Agregar usuario
        </Button>
      </div>
      <Card className={`${cardVisibility ? 'flex' : 'hidden'}`}>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 lg:gap-2"
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 items-start">
                {/* User name */}
                <FormField
                  control={control}
                  name="userName"
                  rules={{
                    required: 'El nombre del usuario es obligatorio',
                    minLength: {
                      value: 2,
                      message: 'Debe tener al menos 2 caracteres',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                        Nombre del usuario
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className=""
                          placeholder="ej. Juan Pérez"
                        />
                      </FormControl>
                      <FormMessage className="mt-1.5 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* User email */}
                <FormField
                  control={control}
                  name="userEmail"
                  rules={{
                    required: 'El correo es obligatorio',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Ingresa un correo válido',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                        Correo
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          className=""
                          placeholder="ej. usuario@correo.com"
                        />
                      </FormControl>
                      <FormMessage className="mt-1.5 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* User role */}
                <FormField
                  control={control}
                  name="userRole"
                  rules={{
                    required: 'El rol es obligatorio',
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                        Rol
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-auto px-4 py-2.5 bg-gray-100 border-0 text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500">
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                          {/* No estoy segura si incluir esto */}
                          <SelectItem value="owner">Dueño</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="mt-1.5 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Projects */}
                <FormField
                  control={control}
                  name="projects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                        Proyectos
                      </FormLabel>
                      <MultiSelect
                        options={projects}
                        value={field.value ?? []}
                        onChange={field.onChange}
                        placeholder="Selecciona proyectos"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
              <div className="flex justify-end">
                <Button className="w-fit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar usuario'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
