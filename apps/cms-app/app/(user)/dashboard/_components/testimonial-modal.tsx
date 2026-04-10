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
import { CircleAlert, CircleCheck, CloudUpload, CircleX } from '@repo/ui/lib';
import { Testimonial } from '@/types/testimonials';
import { TestimonialTypeBadge } from './testimonial-type-badge';
import { TestimonialStatusBadge } from './testimonial-status-badge';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';

type TestimonialDetail = {
  category: { name: string; } | null;
  testimonialTags: { tag: { id: string; name: string; }; }[];
  rejectedReason?: string | null;
  member: {
    organization_member: {
      role: string;
      user: { name: string; };
    };
  } | null;
};

interface TestimonialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial | null;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}
const getVideoId = (url: string): string | undefined => {
  if (!url) return undefined;
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : undefined;
};
export function TestimonialModal({
  open,
  onOpenChange,
  testimonial,
  onDelete,
  onPublish,
  onReject,
}: TestimonialModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = session?.user?.role ?? null;

  const { data: detail } = useQuery<TestimonialDetail>({
    queryKey: ['testimonial-detail', testimonial?.id],
    queryFn: async () => {
      const r = await apiClient.get(`/testimonials/getById/${testimonial!.id}`);
      return r.data.data;
    },
    enabled: open && !!testimonial?.id,
  });

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      setRejectReason('');
    }
  }, [open]);

  if (!testimonial) return null;

  // quote = enviado por visitor; case/video = enviado por editor
  const isFromVisitor = testimonial.type === 'quote';
  const canAct = isFromVisitor
    ? ['editor', 'admin', 'owner'].includes(userRole?.toLowerCase() ?? '')
    : ['admin', 'owner'].includes(userRole?.toLowerCase() ?? '');
  const canShowActions = canAct && ['pending', 'review'].includes(testimonial.status);
  const actionLabel = isFromVisitor ? 'Aprobar' : 'Publicar';
  const ActionIcon = isFromVisitor ? CircleCheck : CloudUpload;
  const videoId = getVideoId(testimonial.media_url);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-auto sm:max-w-none max-w-none w-[90vw] md:w-[60vw] max-h-[90dvh]">
        {/* Header */}
        <DialogHeader className="flex flex-row gap-1">
          <DialogTitle className="sr-only">{testimonial.name}</DialogTitle>
          <TestimonialTypeBadge type={testimonial.type} />
          <TestimonialStatusBadge status={testimonial.status} />
        </DialogHeader>
        {/* Avatar/Botones */}
        <section className="flex flex-row justify-between">
          <div className="flex items-center gap-2 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={testimonial.author_photo} alt="User" />
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
          <p className="text-md font-semibold">{testimonial.name}</p>
          <p className="text-sm font-light">{testimonial.content}</p>
          {testimonial.media_url && (
            <div className="mt-4 relative w-full aspect-video rounded-md bg-muted">
              {testimonial.type === 'video' ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <img
                  src={testimonial.media_url}
                  alt={testimonial.media_description}
                  className="w-full rounded-md object-cover"
                />
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {testimonial.media_description}
              </p>
            </div>
          )}
        </section>
        <section className="flex flex-col gap-2">
          {detail?.category && (
            <p className="text-xs">
              CATEGORIA: <span className="text-primary">{detail.category.name}</span>
            </p>
          )}
          {detail?.testimonialTags && detail.testimonialTags.length > 0 && (
            <p className="text-xs">
              TAGS:{' '}
              <span className="text-primary">
                {detail.testimonialTags.map((t) => t.tag.name).join(', ')}
              </span>
            </p>
          )}
          {detail?.member && (
            <p className="text-xs">
              CREADO POR:{' '}
              <span className="text-xs">
                {detail.member.organization_member.user.name}{' '}
                <span className="text-muted-foreground">({detail.member.organization_member.role})</span>
              </span>
            </p>
          )}
          {testimonial.status === 'rejected' && detail?.rejectedReason && (
            <div className="mt-1 rounded-md border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-xs font-semibold text-destructive mb-1">Motivo de rechazo</p>
              <p className="text-xs text-destructive/80">{detail.rejectedReason}</p>
            </div>
          )}
        </section>
        {/* Footer */}
        <DialogFooter>
          {canShowActions && (
            <div className={`${isEditing ? 'hidden' : 'flex'} gap-1`}>
              <Button variant="destructive" onClick={() => setIsEditing(true)}>
                Rechazar <CircleAlert />
              </Button>
              <Button
                onClick={() => {
                  if (!testimonial) return;
                  onPublish(testimonial.id);
                }}
              >
                {actionLabel} <ActionIcon />
              </Button>
            </div>
          )}
          <div className={`${isEditing ? 'flex' : 'hidden'} w-full`}>
            <Field>
              <FieldLabel htmlFor="textarea-message">Observaciones</FieldLabel>
              <Textarea
                id="textarea-message"
                placeholder="Escribe aquí los motivos por los que se rechaza el testimonio..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex gap-1 justify-end">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (!testimonial) return;
                    onReject(testimonial.id, rejectReason);
                  }}
                >
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
