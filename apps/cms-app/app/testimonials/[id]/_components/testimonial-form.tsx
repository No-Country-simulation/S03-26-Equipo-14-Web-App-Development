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
import { Camera, Pencil, Star } from "@repo/ui/lib";

const MAX_CHARS = 300;

type TestimonialFormValues = {
  fullName: string;
  role: string;
  rating: number;
  content: string;
};

interface TestimonialFormProps {
  testimonialId: string;
}

export function TestimonialForm({ testimonialId }: TestimonialFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  const form = useForm<TestimonialFormValues>({
    defaultValues: {
      fullName: "",
      role: "",
      rating: 0,
      content: "",
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  async function onSubmit(data: TestimonialFormValues) {
    // TODO: enviar datos a la API con testimonialId
    console.log({ testimonialId, ...data, photo });
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 border-t-primary border-t-4" noValidate>
        {/* foto de perfil */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border overflow-hidden"
            >
              {photo ? (
                <Image
                  src={photo}
                  alt="Foto de perfil"
                  fill
                  className="object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-muted-foreground" />
              )}
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
            >
              <Pencil className="w-3 h-3 text-primary-foreground" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Foto de perfil (opcional)
          </span>
        </div>

        {/* nombre y cargo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="fullName"
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
            name="role"
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
                <div className="relative">
                  <Textarea
                    placeholder="Cuéntanos sobre tu experiencia con Geist EdTech..."
                    rows={5}
                    className="resize-none pb-6"
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

        <p className="text-center text-xs text-muted-foreground">
          Al enviar este formulario, aceptas nuestros{" "}
          <a href="#" className="underline hover:text-foreground">
            Términos de Servicio
          </a>{" "}
          y{" "}
          <a href="#" className="underline hover:text-foreground">
            Privacidad
          </a>
          .
        </p>
      </form>
    </Form>
  );
}
