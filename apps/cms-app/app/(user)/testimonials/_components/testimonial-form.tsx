'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  toast,
} from '@repo/ui';
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  FileText,
  ImageIcon,
  Save,
  Video,
  X,
} from '@repo/ui/lib';
import { useFileUpload } from '@/shared/hooks/useFileUpload';
import { uploadToCloudinary } from '@/shared/hooks/useCloudinary';
import { handleUpload } from '@/shared/hooks/useApiYoutube';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import apiClient from '@/shared/lib/apiClient';
import { useProjectStore } from '@/store/useProjectStore';

function toSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

/* ─── types ─────────────────────────────────────────────── */

type TabValue = 'caso' | 'video';

interface TestimonialFormValues {
  author: string;
  authorRole: string;
  title: string;
  content: string;
  videoSummary: string;
  categoryId: string;
  tagIds: string[];
  isDraft: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

export interface TestimonialFormProps {
  mode?: 'create' | 'edit';
  defaultValues?: Partial<TestimonialFormValues>;
  testimonialId?: string;
}

/* ─── DropZone sub-component ─────────────────────────────── */

interface DropZoneProps {
  accept: string;
  maxSizeMB?: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  file: File | null;
  preview: string | null;
  isDragging: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (f: File | null) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onClear: () => void;
  isVideo?: boolean;
}

function DropZone({
  accept,
  icon,
  title,
  subtitle,
  file,
  preview,
  isDragging,
  inputRef,
  onFile,
  onDrop,
  onDragOver,
  onDragLeave,
  onClear,
  isVideo = false,
}: DropZoneProps) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40'}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />

      {preview && !isVideo ? (
        <>
          <div className="relative w-full aspect-video rounded-md overflow-hidden">
            <Image src={preview} alt="Preview" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-background border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : file && isVideo ? (
        <>
          <div className="flex flex-col items-center gap-2">
            {icon}
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-background border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── AvatarUpload sub-component ─────────────────────────── */

interface AvatarUploadProps {
  preview: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (f: File | null) => void;
  onClear: () => void;
}

function AvatarUpload({ preview, inputRef, onFile, onClear }: AvatarUploadProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-dashed border-border p-4">
      <div
        className="relative w-16 h-16 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        {preview ? (
          <>
            <Image src={preview} alt="Avatar" fill className="object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </>
        ) : (
          <Camera className="w-6 h-6 text-muted-foreground" />
        )}
      </div>
      <div>
        <p className="text-sm font-medium">Subir foto de perfil</p>
        <p className="text-xs text-muted-foreground">PNG, JPG hasta 5MB</p>
      </div>
    </div>
  );
}

/* ─── TagsSelect sub-component ───────────────────────────── */

interface TagsSelectProps {
  tags: Tag[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

function TagsSelect({ tags, selected, onChange }: TagsSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const selectedNames = tags.filter((t) => selected.includes(t.id)).map((t) => t.name);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className={selectedNames.length === 0 ? 'text-muted-foreground' : 'text-foreground'}>
          {selectedNames.length === 0 ? 'Seleccionar tags...' : selectedNames.join(', ')}
        </span>
        <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover shadow-md">
          {tags.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">Sin opciones</p>
          ) : (
            <div className="p-1 max-h-48 overflow-y-auto">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggle(tag.id)}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <div className={`flex h-4 w-4 items-center justify-center rounded-sm border ${selected.includes(tag.id) ? 'bg-primary border-primary text-primary-foreground' : 'border-border'}`}>
                    {selected.includes(tag.id) && <Check className="w-3 h-3" />}
                  </div>
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main form ──────────────────────────────────────────── */

export function TestimonialForm({
  mode = 'create',
  defaultValues,
  testimonialId,
}: TestimonialFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabValue>('caso');

  // File upload hooks
  const avatar = useFileUpload({ maxSizeMB: 5 });
  const coverImage = useFileUpload({ maxSizeMB: 10 });
  const videoFile = useFileUpload({ maxSizeMB: 500 });

  const form = useForm<TestimonialFormValues>({
    defaultValues: {
      author: '',
      authorRole: '',
      title: '',
      content: '',
      videoSummary: '',
      categoryId: '',
      tagIds: [],
      isDraft: false,
      ...defaultValues,
    },
    mode: 'onTouched',
  });

  const { control, handleSubmit, watch } = form;
  const isDraft = watch('isDraft');

  const { status, data: session } = useSession();
  const projectId = useProjectStore((s) => s.selectedProjectId);

  // Fetch categories & tags
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: Category[]; }>('/category');
      return r.data.data ?? [];
    },
    enabled: status === 'authenticated',
  });

  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const r = await apiClient.get<{ data: Tag[]; }>('/tag');
      return r.data.data ?? [];
    },
    enabled: status === 'authenticated',
  });

  // Submit mutation
  const mutation = useMutation({
    mutationFn: async (data: TestimonialFormValues) => {
      // Upload files
      let authorPhotoUrl: string | undefined;
      if (avatar.file) {
        const result = await uploadToCloudinary({ file: avatar.file, folder: 'testimonial_avatars' });
        if (result.success) authorPhotoUrl = result.url;
      }

      let mediaUrl: string | undefined;
      if (activeTab === 'caso' && coverImage.file) {
        const result = await uploadToCloudinary({ file: coverImage.file, folder: `${testimonialId}_cover` });
        if (result.success) mediaUrl = result.url;
      }
      if (activeTab === 'video' && videoFile.file) {
        toast.loading('Subiendo video a la nube...', { id: 'video-upload' });
        const youtubeUrl = await handleUpload({
          file: videoFile.file,
          title: data.videoSummary || 'Testimonio',
          description: data.videoSummary,
        });
        toast.dismiss('video-upload');
        mediaUrl = youtubeUrl;
      }

      const endpoint = mode === 'edit' && testimonialId
        ? `/testimonials/${testimonialId}`
        : '/testimonials';

      const titleValue = activeTab === 'caso' ? data.title : (data.videoSummary || 'Video Testimonio');

      if (mode === 'edit') {
        const updateBody = {
          author: data.author,
          authorRole: data.authorRole,
          authorPhoto: authorPhotoUrl ?? '',
          title: titleValue,
          content: activeTab === 'caso' ? data.content : data.videoSummary,
          mediaUrl: mediaUrl ?? '',
          mediaDescription: activeTab === 'video' ? data.videoSummary : '',
          categoryId: data.categoryId,
          slug: toSlug(titleValue),
          rating: 5,
          draft: data.isDraft,
        };
        const response = await apiClient.patch(endpoint, updateBody);
        return response.data;
      }

      const createBody = {
        type: activeTab === 'video' ? 'video' : 'case',
        memberId: session?.user?.id ?? '',
        projectId: 'e37003ed-f740-417d-9d45-48fde41a9bd4',
        categoryId: data.categoryId,
        author: data.author,
        authorRole: data.authorRole,
        authorPhoto: authorPhotoUrl ?? '',
        title: titleValue,
        content: activeTab === 'caso' ? data.content : data.videoSummary,
        mediaUrl: mediaUrl ?? '',
        mediaDescription: activeTab === 'video' ? data.videoSummary : '',
        slug: toSlug(titleValue),
        rating: 5,
        status: data.isDraft ? 'draft' : 'pending',
      };
      console.log(createBody);

      const response = await apiClient.post(endpoint, createBody);
      return response.data;
    },
    onSuccess: () => {
      router.back();
    },
  });

  const onSubmit = (data: TestimonialFormValues) => {
    toast.promise(mutation.mutateAsync(data), {
      loading: 'Guardando testimonio...',
      success: 'Testimonio guardado exitosamente',
      error: 'Error al guardar el testimonio',
    });
  };

  const isCreate = mode === 'create';
  const submitLabel = isDraft ? 'Guardar' : isCreate ? 'Crear testimonio' : 'Actualizar testimonio';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isCreate ? 'Crear Testimonio' : 'Editar Testimonio'}
          </h1>
          {isCreate && (
            <p className="text-muted-foreground mt-1 text-sm">
              Añade una nueva historia de éxito a la plataforma. Los testimonios ayudan a construir confianza con futuros estudiantes.
            </p>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
              <TabsList>
                <TabsTrigger value="caso" className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  Caso
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-1.5">
                  <Video className="w-4 h-4" />
                  Video
                </TabsTrigger>
              </TabsList>

              {/* ── AUTHOR section (shared) ── */}
              <div className="mt-6 space-y-4">
                <div className="border-b pb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Información del Autor
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Detalles de la persona que brinda el testimonio
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="author"
                    rules={{ required: 'El nombre del autor es requerido' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del autor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. Mariana Rodriguez" {...field} />
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
                        <FormLabel>Cargo/Empresa (Opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej. Senior UX Designer en TechCorp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-sm">Avatar del Autor (Opcional)</Label>
                  <AvatarUpload
                    preview={avatar.preview}
                    inputRef={avatar.inputRef}
                    onFile={avatar.handleFile}
                    onClear={avatar.clear}
                  />
                </div>
              </div>

              {/* ── CONTENT section ── */}
              <TabsContent value="caso" className="mt-6 space-y-4">
                <div className="border-b pb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Contenido
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    El mensaje principal y elementos visuales del testimonio
                  </p>
                </div>

                <FormField
                  control={control}
                  name="title"
                  rules={{ required: 'El título es requerido' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del Testimonio</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. 'Este curso cambió mi carrera profesional'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="content"
                  rules={{ required: 'La descripción es requerida' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escribe aquí el relato detallado del estudiante..."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="mb-2 block text-sm">Imagen de Portada (Opcional)</Label>
                  <DropZone
                    accept="image/png,image/jpeg,image/jpg"
                    maxSizeMB={10}
                    icon={<ImageIcon className="w-6 h-6" />}
                    title="Haz clic para seleccionar imagen"
                    subtitle="Recomendado: 1200×630px"
                    file={coverImage.file}
                    preview={coverImage.preview}
                    isDragging={coverImage.isDragging}
                    inputRef={coverImage.inputRef}
                    onFile={coverImage.handleFile}
                    onDrop={coverImage.handleDrop}
                    onDragOver={coverImage.handleDragOver}
                    onDragLeave={coverImage.handleDragLeave}
                    onClear={coverImage.clear}
                  />
                </div>
              </TabsContent>

              <TabsContent value="video" className="mt-6 space-y-4">
                <div className="border-b pb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Contenido
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    El mensaje principal y elementos visuales del testimonio
                  </p>
                </div>

                <div>
                  <Label className="mb-2 block text-sm">Video</Label>
                  <DropZone
                    accept="video/mp4,video/quicktime,video/x-msvideo"
                    maxSizeMB={500}
                    icon={<Video className="w-6 h-6" />}
                    title="Arrastra y suelta tu video aquí"
                    subtitle="MP4, MOV o AVI. Máx. 500 MB. Se subirá a YouTube automáticamente."
                    file={videoFile.file}
                    preview={videoFile.preview}
                    isDragging={videoFile.isDragging}
                    inputRef={videoFile.inputRef}
                    onFile={videoFile.handleFile}
                    onDrop={videoFile.handleDrop}
                    onDragOver={videoFile.handleDragOver}
                    onDragLeave={videoFile.handleDragLeave}
                    onClear={videoFile.clear}
                    isVideo
                  />
                </div>

                <FormField
                  control={control}
                  name="videoSummary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resumen del video</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="¿Cuál es el mensaje principal de este video? Escribe un breve resumen de lo que trata el video..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            {/* ── CATEGORIZATION ── */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Categorización
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Organiza este contenido para facilitar su búsqueda
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar categoría..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="tagIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <TagsSelect
                          tags={tags}
                          selected={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ── DRAFT ── */}
            <FormField
              control={control}
              name="isDraft"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 rounded-lg border border-border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="font-semibold cursor-pointer">
                      Guardar como borrador (Draft)
                    </FormLabel>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      El testimonio no será visible al público hasta que se publique manualmente.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* ── ACTIONS ── */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {isDraft ? (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    Guardar
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    {submitLabel}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
