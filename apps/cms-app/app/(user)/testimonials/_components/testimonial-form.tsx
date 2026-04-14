'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Check,
  FileText,
  ImageIcon,
  Save,
  Video,
} from '@repo/ui/lib';
import { useFileUpload } from '@/shared/hooks/useFileUpload';
import { uploadToCloudinary } from '@/shared/hooks/useCloudinary';
import { handleUpload } from '@/shared/hooks/useApiYoutube';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import apiClient from '@/shared/lib/apiClient';
import { useProjectStore } from '@/store/useProjectStore';
import { DropZone } from './drop-zone';
import { AvatarUpload } from './avatar-upload';
import { TagsSelect } from './tags-select';
import type { Category, TabValue, Tag, TestimonialFormProps, TestimonialFormValues } from './types';
import { toSlug } from './types';
import { updateTag } from 'next/cache';

/* ─── Main form ──────────────────────────────────────────── */

export function TestimonialForm({
  mode = 'create',
  defaultValues,
  testimonialId,
  defaultTab,
  existingAuthorPhoto,
  existingMediaUrl,
}: TestimonialFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabValue>(defaultTab ?? 'caso');
  const [currentMediaUrl, setCurrentMediaUrl] = useState<string | undefined>(existingMediaUrl);
  const [currentAuthorPhoto, setCurrentAuthorPhoto] = useState<string | undefined>(existingAuthorPhoto);

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

  const { currentMemberId, currentProject } = useProjectStore();

  // Fetch categories & tags
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories', currentProject?.id],
    queryFn: async () => {
      const r = await apiClient.get<{ data: Category[]; }>(`/categories/${currentProject?.id}`);
      return r.data.data ?? [];
    },
    enabled: !!currentProject?.id,
  });

  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ['tags', currentProject?.id],
    queryFn: async () => {
      const r = await apiClient.get<{ data: Tag[]; }>(`/tag`);
      return r.data.data ?? [];
    },
    enabled: !!currentProject?.id,
  });

  // Submit mutation
  const mutation = useMutation({
    mutationFn: async (data: TestimonialFormValues) => {
      // Upload files
      let authorPhotoUrl: string | undefined;
      const folder = `${testimonialId ?? Date.now()}`;
      if (avatar.file) {
        const result = await uploadToCloudinary({ file: avatar.file, folder: `${currentProject?.id}/${folder}/avatar` });
        if (result.success) authorPhotoUrl = result.url;
      }

      let mediaUrl: string | undefined;
      if (activeTab === 'caso' && coverImage.file) {
        const result = await uploadToCloudinary({ file: coverImage.file, folder: `${currentProject?.id}/${folder}/cover` });
        if (result.success) mediaUrl = result.url;
      }
      if (activeTab === 'video' && videoFile.file) {
        toast.loading('Subiendo video a la nube...', { id: 'video-upload' });
        const youtubeUrl = await handleUpload({
          file: videoFile.file,
          title: `${currentProject?.name} - ${data?.author} - Testimonio` || 'Testimonio',
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
        const prev = defaultValues ?? {};
        const prevTitle = activeTab === 'caso' ? (prev.title ?? '') : (prev.videoSummary ?? 'Video Testimonio');
        const prevContent = activeTab === 'caso' ? (prev.content ?? '') : (prev.videoSummary ?? '');
        const newContent = activeTab === 'caso' ? data.content : data.videoSummary;
        const newMediaDescription = activeTab === 'video' ? data.videoSummary : '';
        const prevMediaDescription = activeTab === 'video' ? (prev.videoSummary ?? '') : '';

        const fullBody: Record<string, unknown> = { draft: data.isDraft };

        if (data.author !== (prev.author ?? '')) fullBody.author = data.author;
        if (data.authorRole !== (prev.authorRole ?? '')) fullBody.authorRole = data.authorRole;
        if (newContent !== prevContent) fullBody.content = newContent;
        if (data.categoryId !== (prev.categoryId ?? '')) fullBody.categoryId = data.categoryId;
        if (newMediaDescription !== prevMediaDescription) fullBody.mediaDescription = newMediaDescription;

        if (titleValue !== prevTitle) {
          fullBody.title = titleValue;
          fullBody.slug = toSlug(titleValue);
        }

        if (authorPhotoUrl) fullBody.authorPhoto = authorPhotoUrl;
        else if (currentAuthorPhoto === undefined && existingAuthorPhoto) fullBody.authorPhoto = '';

        if (mediaUrl) fullBody.mediaUrl = mediaUrl;
        else if (currentMediaUrl === undefined && existingMediaUrl) fullBody.mediaUrl = '';

        const prevTagIds = (prev.tagIds ?? []).slice().sort().join(',');
        const newTagIds = data.tagIds.slice().sort().join(',');
        if (newTagIds !== prevTagIds) fullBody.tags = data.tagIds;

        const response = await apiClient.patch(endpoint, fullBody);
        return response.data;
      }

      const createBody = {
        type: activeTab === 'video' ? 'video' : 'case',
        memberId: currentMemberId ?? '',
        projectId: currentProject?.id ?? '',
        categoryId: data.categoryId,
        tags: data.tagIds,
        author: data.author,
        authorRole: data.authorRole,
        authorPhoto: authorPhotoUrl ?? '',
        title: titleValue,
        content: activeTab === 'caso' ? data.content : data.videoSummary,
        mediaUrl: mediaUrl ?? '',
        mediaDescription: activeTab === 'video' ? data.videoSummary : '',
        slug: toSlug(titleValue),
        status: data.isDraft ? 'draft' : 'pending',
      };
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
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className='flex flex-col'>
              <TabsList>
                <TabsTrigger
                  value="caso"
                  disabled={activeTab === 'video' && !!(videoFile.file || currentMediaUrl)}
                  className="flex items-center gap-1.5 aria-[selected=true]:bg-white aria-[selected=true]:text-foreground "
                >
                  <FileText className="w-4 h-4" />
                  Caso
                </TabsTrigger>
                <TabsTrigger
                  value="video"
                  disabled={activeTab === 'caso' && !!(coverImage.file || currentMediaUrl)}
                  className="flex items-center gap-1.5 aria-[selected=true]:bg-white aria-[selected=true]:text-foreground "
                >
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
                    existingUrl={currentAuthorPhoto}
                    inputRef={avatar.inputRef}
                    onFile={avatar.handleFile}
                    onClear={() => { avatar.clear(); setCurrentAuthorPhoto(undefined); }}
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
                    existingUrl={activeTab === 'caso' ? currentMediaUrl : undefined}
                    isDragging={coverImage.isDragging}
                    inputRef={coverImage.inputRef}
                    onFile={coverImage.handleFile}
                    onDrop={coverImage.handleDrop}
                    onDragOver={coverImage.handleDragOver}
                    onDragLeave={coverImage.handleDragLeave}
                    onClear={() => { coverImage.clear(); setCurrentMediaUrl(undefined); }}
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
                    existingUrl={activeTab === 'video' ? currentMediaUrl : undefined}
                    isDragging={videoFile.isDragging}
                    inputRef={videoFile.inputRef}
                    onFile={videoFile.handleFile}
                    onDrop={videoFile.handleDrop}
                    onDragOver={videoFile.handleDragOver}
                    onDragLeave={videoFile.handleDragLeave}
                    onClear={() => { videoFile.clear(); setCurrentMediaUrl(undefined); }}
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
