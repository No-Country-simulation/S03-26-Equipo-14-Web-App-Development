'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from '@repo/ui/components';
import { Pencil } from '@repo/ui/lib';

type Role = 'Admin' | 'Editor';

interface ChangeRoleDialogProps {
  userId: string;
  currentRole: Role;
  onSuccess: () => void;
}

export function ChangeRoleDialog({
  userId,
  currentRole,
  onSuccess,
}: ChangeRoleDialogProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>(currentRole);

  const mutation = useMutation({
    mutationFn: () =>
      apiClient.patch(`/organization/member/role/${userId}`, { role }),
    onSuccess: () => {
      toast.success('Rol actualizado correctamente');
      setOpen(false);
      onSuccess();
    },
    onError: () => {
      toast.error('Error al cambiar el rol');
    },
  });

  const handleOpen = () => {
    setRole(currentRole);
    setOpen(true);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpen}>
        <Pencil className="size-4 mr-1" />
        Cambiar rol
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar rol del miembro</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Select
              value={role}
              onValueChange={(v) => setRole(v as Role)}
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending || role === currentRole}
            >
              {mutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
