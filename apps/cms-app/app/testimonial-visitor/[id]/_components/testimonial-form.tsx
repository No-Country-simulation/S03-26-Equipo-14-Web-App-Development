"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  toast,
} from "@repo/ui/components";
import { Camera, Check, Pencil, Star, X } from "@repo/ui/lib";
import { uploadToCloudinary } from '@/shared/hooks/useCloudinary';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';

const MAX_CHARS = 300;

type TestimonialFormValues = {
  author: string;
  authorRole: string;
  mediaUrl: string;
  rating: number;
  type: string;
  authorPhoto?: File | null;
  projectId?: string;
  content: string;
};

interface TestimonialFormProps {
  projectId: string;
}

export function TestimonialForm({ projectId }: TestimonialFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<TestimonialFormValues>({
    defaultValues: {
      author: "",
      authorRole: "",
      mediaUrl: "",
      rating: 0,
      content: "",
      type: 'quote',
    },
    mode: "onTouched",
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
  } = form;

  const content = watch("content");
  const rating = watch("rating");
  const remaining = MAX_CHARS - (content?.length ?? 0);
  const createdTestimonial = useMutation({
    mutationFn: async (data: TestimonialFormValues): Promise<void> => {
      const authorPhoto = data.authorPhoto ? await uploadToCloudinary({ file: data.authorPhoto, folder: `${projectId}/visitors` }) : null;
      const sendData = { ...data, ...(authorPhoto?.url ? { authorPhoto: authorPhoto.url } : {}), projectId };
      const response = await apiClient.post('/testimonials/quote', sendData);
      return response.data;
    },
    onSuccess: () => {
      form.reset();
      setTimeout(() => router.back(), 5000);
    }
  });

  async function onSubmit(data: TestimonialFormValues) {
    toast.promise(createdTestimonial.mutateAsync(data), {
      loading: 'Enviando testimonio...',
      success: 'Testimonio enviado exitosamente',
      error: 'Error al enviar el testimonio',
    });
  }
  return (
    <>
      {createdTestimonial.isSuccess ? (
        <div className="flex flex-col items-center justify-center gap-6 p-12 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary">
            <Check className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">¡Gracias por compartir tu historia!</h2>
            <p className="text-muted-foreground max-w-sm">
              Tu testimonio ha sido enviado correctamente y está en proceso de revisión.
              Tu opinión es fundamental para ayudar a otros estudiantes a tomar la mejor decisión.
            </p>
          </div>
          <hr className="w-full border-border" />
          <p className="text-sm text-muted-foreground">Serás redirigido en unos segundos...</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 border-t-primary border-t-4" noValidate>
            {/* foto de perfil */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-20 h-20 flex border-0 rounded-lg bg-muted items-center justify-center ">
                {!watch('authorPhoto') ? <>
                  <Camera className="w-8 h-8 text-muted-foreground" />
                  <span className="p-2 absolute bg-primary rounded-full -bottom-1 -right-1">
                    <Pencil className='w-3 h-3 text-primary-foreground' />
                  </span>
                  <Input type='file' accept="image/*" className="absolute opacity-0 w-full h-full  cursor-pointer z-10" ref={fileInputRef} onChange={(e) => setValue('authorPhoto', e.target.files?.[0] ?? null)} />
                </> :
                  <>
                    <Image
                      src={URL.createObjectURL(watch('authorPhoto')!)}
                      alt="Foto de perfil"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <span onClick={() => setValue('authorPhoto', null)} className="cursor-pointer p-2 absolute bg-primary rounded-full -bottom-1 -right-1">
                      <X className='w-3 h-3 text-primary-foreground' />
                    </span>
                  </>}
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                Foto de perfil (opcional)
              </span>
            </div>

            {/* nombre y cargo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="author"
                rules={{ required: "El nombre es requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-widest">
                      Nombre completo
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Ana García" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="authorRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground uppercase tracking-widest">
                      Cargo / Empresa (opcional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Estudiante de UX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="mediaUrl"
              rules={{
                pattern: {
                  value: /^$|^(https?:\/\/).+/i,
                  message: "Ingresa una URL valida que inicie con http:// o https://",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground uppercase tracking-widest">
                    URL de video (opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="Ej. https://youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* calificación */}
            <FormField
              control={control}
              name="rating"
              rules={{ min: { value: 1, message: "Selecciona una calificación" } }}
              render={({ field, fieldState }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="text-xs text-muted-foreground uppercase tracking-widest">
                    Calificación
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => field.onChange(star)}
                          className="p-0.5"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${star <= (hoveredRating || field.value)
                              ? "fill-primary text-primary"
                              : "text-border"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* comentario con contador */}
            <FormField
              control={control}
              name="content"
              rules={{
                required: "El comentario es requerido",
                maxLength: {
                  value: MAX_CHARS,
                  message: `Máximo ${MAX_CHARS} caracteres`,
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground uppercase tracking-widest">
                    Tu comentario
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex w-full">
                      <Textarea
                        placeholder="Cuéntanos sobre tu experiencia con Geist EdTech..."
                        rows={5}
                        className="w-full min-w-0 resize-y break-all [overflow-wrap:anywhere]"
                        {...field}
                        onChange={(e) => {
                          if (e.target.value.length <= MAX_CHARS) {
                            field.onChange(e);
                          }
                        }}
                      />
                      <span
                        className={`absolute bottom-2 right-3 text-xs pointer-events-none ${remaining <= 20 ? "text-destructive" : "text-muted-foreground"
                          }`}
                      >
                        {remaining}/{MAX_CHARS}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* botones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={createdTestimonial.isPending || rating === 0}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {createdTestimonial.isPending ? "Enviando..." : "Enviar Testimonio"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="text-foreground"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
