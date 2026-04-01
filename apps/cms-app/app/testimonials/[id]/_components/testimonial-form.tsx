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
} from "@repo/ui/components";
import { Camera, Pencil, Star, X } from "@repo/ui/lib";
import { uploadToCloudinary } from '@/shared/hooks/useCloudinary';
import { useMutation } from '@tanstack/react-query';

const MAX_CHARS = 300;

type TestimonialFormValues = {
  author: string;
  authorRole: string;
  mediaUrl: string;
  rating: number;
  type: string;
  authorPhoto?: string;
  projectId?: string;
  content: string;
};

interface TestimonialFormProps {
  projectId: string;
}

export function TestimonialForm({ projectId }: TestimonialFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<File | null>(null);
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
    formState: { isSubmitting },
  } = form;

  const content = watch("content");
  const rating = watch("rating");
  const remaining = MAX_CHARS - (content?.length ?? 0);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if (e === null) {
      setPhoto(null);
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
  };
  const createdTestimonial = useMutation({
    mutationFn: async (data: TestimonialFormValues) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/testimonials/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create testimonial');
      }
    },
    onSuccess: () => { },
    onError: (error) => {
      console.error('Error creating testimonial:', error);
    }
  });

  async function onSubmit(data: TestimonialFormValues) {
    // TODO: enviar datos a la API con projectId
    uploadToCloudinary({ file: photo as File, folder: `${projectId}_visitors` })
      .then((result) => {
        if (result.success && result.url) {
          const testimonialData = { ...data, authorPhoto: result.url, type: 'quote', projectId };
          createdTestimonial.mutate(testimonialData);
          console.log({ projectId, ...data, authorPhoto: result.url, type: 'quote' });
        } else {
          console.error('Error uploading to Cloudinary:', result.error);
        }
        console.log({ projectId, ...data, photo, type: 'quote' });
      });
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 border-t-primary border-t-4" noValidate>
        {/* foto de perfil */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-20 h-20 flex border-0 rounded-lg bg-muted items-center justify-center ">
            {!photo ? <>
              <Camera className="w-8 h-8 text-muted-foreground" />
              <span className="p-2 absolute bg-primary rounded-full -bottom-1 -right-1">
                <Pencil className='w-3 h-3 text-primary-foreground' />
              </span>
              <Input type='file' accept="image/*" className="absolute opacity-0 w-full h-full  cursor-pointer z-10" ref={fileInputRef} onChange={handlePhotoChange} />
            </> :
              <>
                <Image
                  src={URL.createObjectURL(photo)}
                  alt="Foto de perfil"
                  fill
                  className="object-cover rounded-lg"
                />
                <span onClick={() => handlePhotoChange(null)} className="cursor-pointer p-2 absolute bg-primary rounded-full -bottom-1 -right-1">
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
            disabled={isSubmitting || rating === 0}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? "Enviando..." : "Enviar Testimonio"}
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
  );
}
