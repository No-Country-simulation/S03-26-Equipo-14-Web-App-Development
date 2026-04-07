import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldLabel,
  Textarea,
} from '@repo/ui/components';
import { CircleAlert, CloudUpload, CircleX } from '@repo/ui/lib';
import { Testimonial } from '@/types/testimonials';
import { TestimonialTypeBadge } from './testimonial-type-badge';
import { TestimonialStatusBadge } from './testimonial-status-badge';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function TestimonialModal({
  open,
  onOpenChange,
  testimonial,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial | null;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!open) {
      setIsEditing(false);
    }
  }, [open]);
  if (!testimonial) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* Header */}
        <DialogHeader className="flex flex-row gap-1">
          <DialogTitle className="sr-only">{testimonial.title}</DialogTitle>
          <TestimonialTypeBadge type={testimonial.type} />
          <TestimonialStatusBadge status={testimonial.status} />
        </DialogHeader>
        {/* Avatar/Botones */}
        <section className="flex flex-row justify-between">
          <div className="flex items-center gap-2 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback className="rounded-lg">NU</AvatarFallback>
            </Avatar>
            <div className="grid flex-1">
              <span className="truncate font-semibold">
                {testimonial.author}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {testimonial.authorRole}
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              size="xs"
              variant="outline"
              className="p-1"
              onClick={() =>
                router.push(`/testimonials/edit/${testimonial.id}`)
              }
            >
              Editar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="xs"
                  className="p-1 bg-background border border-destructive hover:bg-red-100"
                >
                  <span className="text-destructive">Eliminar</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar testimonio?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer, se borrará permanentemente
                    de tu dashboard
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      if (!testimonial) return;
                      onDelete(testimonial.id);
                    }}
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>
        {/* Contenido */}
        <section>
          <p className="text-md font-semibold">{testimonial.title}</p>
          <p className="text-sm font-light">{testimonial.content}</p>
          <p>Media</p>
        </section>
        <section className="flex flex-col gap-2">
          <p className="text-xs">
            CATEGORIA: <span className="text-primary">EVENTO</span>
          </p>
          <p className="text-xs">
            TAGS:{' '}
            <span className="text-primary">crecimiento, éxito, felicidad</span>
          </p>
          <p className="text-xs">
            CREADOR POR: <span className="text-xs">Nombre del editor</span>
          </p>
        </section>
        {/* Footer */}
        <DialogFooter>
          <div className={`${isEditing ? 'hidden' : 'flex'}`}>
            {/* Sirve para: 
            - un editor que rechaza un testimonio visitor
            - un admin/owner que rechaza un testimonio editor */}
            <Button variant="destructive" onClick={() => setIsEditing(true)}>
              Rechazar <CircleAlert />
            </Button>

            {/* Sirve para: 
            - un editor que aprueba un testimonio visitor
            - un admin/owner que "aprueba" un testimonio editor */}
            {/* <Button>
            {rolDelMember === 'editor' ? (
              <>
                <CircleCheck />
                Aprobar
              </>
            ) : (
              <>
                <CloudUpload className="mr-2 h-4 w-4" />
                Publicar
              </>
            )}
          </Button> */}
            <Button>
              Publicar <CloudUpload />
            </Button>
          </div>
          {/* Solo debe funcionar para el caso de: un admin/owner que rechaza un testimonio editor */}
          <div className={`${isEditing ? 'flex' : 'hidden'}`}>
            <Field>
              <FieldLabel htmlFor="textarea-message">Observaciones</FieldLabel>
              <Textarea
                id="textarea-message"
                placeholder="Escribe aquí los motivos por los que se rechaza el testimonio..."
              />
              <div className="flex gap-1 justify-end">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive">
                  Enviar observaciones y rechazar <CircleX />
                </Button>
              </div>
            </Field>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
