'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import apiClient from '@/shared/lib/apiClient';
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Skeleton,
  toast,
} from '@repo/ui/components';
import { getInitials } from '../../settings/_components/table';

interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  organizationId?: string;
  role: string;
};

export function ProfileForm() {
  const { data: session, status, update } = useSession();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const { data: userData } = useQuery<CurrentUser>({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/me');
      return response.data.data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (userData) {
      setName(userData.name ?? '');
      setEmail(userData.email ?? '');
    }
  }, [userData]);

  const mutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      apiClient.patch('/auth/profile', payload),
    onSuccess: async (res) => {
      const updated = res.data?.data ?? res.data;
      await update({ name: updated.name, email: updated.email });
      setName(updated.name ?? name);
      setEmail(updated.email ?? email);
      toast.success('Perfil actualizado correctamente.');
    },
    onError: () => {
      toast.error('Error al actualizar el perfil. Intenta de nuevo.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateProfilePayload = {};
    if (name.trim() && name !== session?.user?.name) payload.name = name.trim();
    if (email.trim() && email !== session?.user?.email)
      payload.email = email.trim();
    if (Object.keys(payload).length === 0) {
      toast.info('No hay cambios que guardar.');
      return;
    }
    mutation.mutate(payload);
  };

  if (status === 'loading') {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-28 self-end" />
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="flex flex-col gap-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
          <CardDescription>
            Actualiza tu nombre y correo electrónico.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {getInitials(userData?.name ?? '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-base leading-tight">
                {userData?.name ?? ''}
              </p>
              <p className="text-sm text-muted-foreground">
                {userData?.role ?? 'Miembro'}
              </p>
            </div>
          </div>

          <Separator className="mb-6" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-name">Nombre</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                disabled={mutation.isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-email">Correo electrónico</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={mutation.isPending}
              />
            </div>

            <div className="flex justify-end mt-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
