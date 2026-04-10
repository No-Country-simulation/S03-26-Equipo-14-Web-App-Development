'use client';

import { useState } from 'react';
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
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from '@repo/ui/components';
import { UserPlus } from '@repo/ui/lib';

interface Project {
  id: string;
  name: string;
}

interface AddMemberDialogProps {
  onSuccess: () => void;
}

export function AddMemberDialog({ onSuccess }: AddMemberDialogProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    email: '',
    name: '',
    role: 'Editor',
    projectId: '',
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Project[]; }>('/projects');
      console.log(res, 'res');

      return res.data.data;
    },
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () =>
      apiClient.post('/auth/member', {
        email: form.email,
        name: form.name,
        role: form.role,
        organizationId: session?.user?.organizationId,
        projectId: form.projectId,
      }),
    onSuccess: () => {
      toast.success('Miembro agregado. Se le envió su contraseña por email.');
      setOpen(false);
      setForm({ email: '', name: '', role: 'Editor', projectId: '' });
      onSuccess();
    },
    onError: () => {
      toast.error('Error al agregar el miembro. Verifica que el email no esté ya registrado en la organización.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name || !form.projectId) {
      toast.error('Completa todos los campos');
      return;
    }
    mutation.mutate();
  };

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre completo"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@ejemplo.com"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Rol</Label>
            <Select
              value={form.role}
              onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Proyecto inicial</Label>
            <Select
              value={form.projectId}
              onValueChange={(v) => setForm((f) => ({ ...f, projectId: v }))}
            >
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
          </div>
          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Agregando...' : 'Agregar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
