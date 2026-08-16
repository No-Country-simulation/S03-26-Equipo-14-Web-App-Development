'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
import { BookOpen } from '@repo/ui/lib';
type ValidateTokenFormValues = {
  token: string;
};

export function ValidateTokenForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const form = useForm<ValidateTokenFormValues>({
    defaultValues: { token: '' },
    mode: 'onTouched',
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: ValidateTokenFormValues) {
    setError(null);
    try {
      const res = await fetch(`/api/auth/validate-token?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: data.token }),
      });
      if (!res.ok) {
        const json = await res.json();
        const msg = json?.message ?? 'Código inválido o expirado.';
        setError(Array.isArray(msg) ? msg.join(', ') : msg);
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/reset-password');
      }, 1500);
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
          <p className="text-sm text-gray-500 mt-1">Verificación de código</p>
        </div>

        <Card className="w-full max-w-sm bg-white rounded-2xl shadow-md p-0 gap-0 border-0">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Ingresa el código</h2>
              <p className="text-sm text-gray-500 mt-1">
                Te enviamos un código de 6 dígitos a{' '}
                <span className="font-medium text-gray-700">{email || 'tu correo'}</span>.
              </p>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
                ¡Código verificado! Redirigiendo...
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <FormField
                    control={control}
                    name="token"
                    rules={{
                      required: 'El código es obligatorio',
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'El código debe ser de 6 dígitos',
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                          Código de verificación
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            {...field}
                            className="w-full h-auto px-4 py-2.5 bg-gray-100 border-0 text-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500 text-center tracking-widest text-lg font-semibold"
                            placeholder="000000"
                          />
                        </FormControl>
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
                    {isSubmitting ? 'Verificando...' : 'Verificar código →'}
                  </Button>
                </form>
              </Form>
            )}

            <p className="text-center text-sm text-gray-500 mt-6">
              <Link href="/auth/forgot-password" className="text-indigo-600 font-semibold hover:text-indigo-700">
                ← Reenviar código
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
