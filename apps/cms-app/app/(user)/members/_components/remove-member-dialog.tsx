'use client';

import { useMutation } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  toast,
} from '@repo/ui/components';
import { Trash2 } from '@repo/ui/lib';

interface RemoveMemberDialogProps {
  memberId: string;
  userId: string;
  onSuccess: () => void;
}

export function RemoveMemberDialog({
  memberId,
  userId,
  onSuccess,
}: RemoveMemberDialogProps) {
  const mutation = useMutation({
    mutationFn: () => apiClient.delete(`/organization/member/${memberId}`),
    onSuccess: () => {
      toast.success('Miembro eliminado correctamente');
      onSuccess();
    },
    onError: () => {
      toast.error('Error al eliminar el miembro');
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="size-4 mr-1" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar miembro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente la cuenta del usuario{' '}
            <span className="font-mono text-xs">{userId}</span> de la
            plataforma. No se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
