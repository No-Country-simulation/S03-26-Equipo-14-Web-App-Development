'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BadgeCheck, BarChart2, BookOpen, CheckCircle2, Sparkles } from '@repo/ui/lib';
import { useForm } from 'react-hook-form';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from '@repo/ui';

type RegisterFormValues = {
  orgName: string;
  projectName: string;
  ownerName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      orgName: '',
      projectName: '',
      ownerName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });
  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: RegisterFormValues) {
    setError(null);

    try {
      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL no está configurada');
      }

      const response = await fetch(`${apiUrl}/auth/owner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.ownerName,
          organizationName: data.orgName,
          organizationDescription: data.projectName,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message =
          body && typeof body.message === 'string'
            ? body.message
            : 'No se pudo registrar la cuenta';
        throw new Error(message);
      }

      toast.success('Cuenta creada correctamente. Ya puedes iniciar sesión.');
      router.push('/auth/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error inesperado';
      setError(message);
      toast.error(message);
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* ── Left side ── */}
      <div className="hidden lg:flex flex-col w-1/2 bg-white px-12 py-10">
        {/* Navbar */}
        <div className="flex items-center gap-2 mb-auto">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-base">Geist EdTech</span>
        </div>

        {/* Hero */}
        <div className="flex flex-col justify-center flex-1 max-w-md gap-4">
          <Badge variant={'secondary'} className='py-2 px-3 bg-indigo-400/10 text-indigo-500'>
            Gestión editorial
          </Badge>

          <h2 className="text-5xl font-light text-gray-900 leading-tight ">
            Cura tu{' '}
            <span className="text-indigo-500 font-light">
              narrativa
              <br />
              educativa.
            </span>
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed mb-10 max-w-xs">
            Únete a la plataforma líder para capturar, gestionar y mostrar el impacto de los estudiantes a través de testimonios estructurados.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-100 rounded-xl p-5 bg-gray-50">
              <div className="w-8 h-8 flex items-center justify-center mb-3">
                <BadgeCheck className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Prueba Social</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Flujos de trabajo automatizados de recopilación y verificación.
              </p>
            </div>
            <div className="border border-gray-100 rounded-xl p-5 bg-gray-50">
              <div className="w-8 h-8 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-indigo-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Control Editorial</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Herramientas de diseño sofisticadas para presentaciones de alta gama.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto" />
      </div>

      {/* ── Right side ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-10">
        <Card className="w-full max-w-md bg-white rounded-2xl shadow-md p-0 gap-0 border-0">
          <CardContent className="p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Crear cuenta</h1>
            <p className="text-sm text-gray-500 mb-7">Ingresa tus datos para empezar a curar.</p>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* Org name */}
                <FormField
                  control={control}
                  name="orgName"
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
                          className="w-full h-auto px-4 py-2.5 bg-gray-100 border-0 text-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
                          placeholder="p. ej. Universidad de Stanford"
                        />
                      </FormControl>
                      <FormMessage className="mt-1.5 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Project name */}
                <FormField
                  control={control}
                  name="projectName"
                  rules={{
                    required: 'El nombre del proyecto es obligatorio',
                    minLength: {
                      value: 2,
                      message: 'Debe tener al menos 2 caracteres',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                        Nombre del proyecto
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="w-full h-auto px-4 py-2.5 bg-gray-100 border-0 text-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
                          placeholder="p. ej. Impacto Alumni 2024"
                        />
                      </FormControl>
                      <FormMessage className="mt-1.5 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Owner name */}
                <FormField
                  control={control}
                  name="ownerName"
                  rules={{
                    required: 'El nombre del owner es obligatorio',
                    minLength: {
                      value: 2,
                      message: 'Debe tener al menos 2 caracteres',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                        Nombre del owner
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className="w-full h-auto px-4 py-2.5 bg-gray-100 border-0 text-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
                          placeholder="Juan Pérez"
                        />
                      </FormControl>
                      <FormMessage className="mt-1.5 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={control}
                  name="email"
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
                          className="w-full h-auto px-4 py-2.5 bg-gray-100 border-0 text-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
                          placeholder="admin@geist.edu"
                        />
                      </FormControl>
                      <FormMessage className="mt-1.5 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Password + Confirm */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={control}
                    name="password"
                    rules={{
                      required: 'La contraseña es obligatoria',
                      minLength: {
                        value: 6,
                        message: 'Debe tener al menos 6 caracteres',
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            className="w-full h-auto px-4 py-2.5 bg-gray-100 border-0 text-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
                            placeholder="••••••••"
                          />
                        </FormControl>
                        <FormMessage className="mt-1.5 text-xs text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="confirmPassword"
                    rules={{
                      required: 'Debes confirmar la contraseña',
                      validate: (value) => value === getValues('password') || 'Las contraseñas no coinciden',
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                          Confirmar password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            className="w-full h-auto px-4 py-2.5 bg-gray-100 border-0 text-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
                            placeholder="••••••••"
                          />
                        </FormControl>
                        <FormMessage className="mt-1.5 text-xs text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 transition-colors duration-200 text-sm mt-2"
                >
                  {isSubmitting ? 'Registrando...' : 'Registrarse →'}
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-gray-500 mt-6">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Inicia sesión aquí
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
