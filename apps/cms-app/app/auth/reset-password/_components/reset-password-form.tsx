'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
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
} from '@repo/ui';
import { BookOpen, Lock } from '@repo/ui/lib';
type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

export function ResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const form = useForm<ResetPasswordFormValues>({
    defaultValues: { newPassword: '', confirmPassword: '' },
    mode: 'onTouched',
  });
  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: ResetPasswordFormValues) {
    setError(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: data.newPassword }),
      });
      if (!res.ok) {
        const json = await res.json();
        const msg = json?.message ?? 'Error al cambiar la contraseña. Inténtalo de nuevo.';
        setError(Array.isArray(msg) ? msg.join(', ') : msg);
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch {
      setError('Ocurrió un error inesperado.');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4 shadow-lg">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Geist EdTech</h1>
          <p className="text-sm text-gray-500 mt-1">Nueva contraseña</p>
        </div>

        <Card className="w-full max-w-sm bg-white rounded-2xl shadow-md p-0 gap-0 border-0">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Crea tu nueva contraseña</h2>
              <p className="text-sm text-gray-500 mt-1">
                Elige una contraseña segura para tu cuenta.
              </p>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                ¡Contraseña actualizada! Redirigiendo al inicio de sesión...
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <FormField
                    control={control}
                    name="newPassword"
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
                          Nueva contraseña
                        </FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              className="w-full h-auto pl-10 pr-4 py-2.5 bg-gray-100 border-0 text-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
                              placeholder="••••••••"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="mt-1.5 text-xs text-red-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="confirmPassword"
                    rules={{
                      required: 'Confirma tu contraseña',
                      validate: (value) =>
                        value === watch('newPassword') || 'Las contraseñas no coinciden',
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                          Confirmar contraseña
                        </FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              className="w-full h-auto pl-10 pr-4 py-2.5 bg-gray-100 border-0 text-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500"
                              placeholder="••••••••"
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="mt-1.5 text-xs text-red-600" />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar nueva contraseña →'}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
