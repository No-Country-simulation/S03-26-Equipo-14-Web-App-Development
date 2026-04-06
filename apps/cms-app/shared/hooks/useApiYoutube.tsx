const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

interface UploadToYouTubeParams {
  file: File;
  title: string;
  description?: string;
}

export const handleUpload = async ({ file, title, description }: UploadToYouTubeParams): Promise<string> => {
  function sanitizeFileName(fileName: string): string {
    return fileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  const safeName = sanitizeFileName(file.name);
  const fileName = `${Date.now()}-${safeName}`;

  // 1. Subir a Supabase Storage
  const storageRes = await fetch(
    `https://ocednvnbopromyirgqpn.supabase.co/storage/v1/object/youtube/${fileName}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': file.type,
      },
      body: file,
    },
  );

  if (!storageRes.ok) {
    const storageError = await storageRes.text();
    throw new Error(`Error subiendo a Storage: ${storageError}`);
  }

  // 2. Invocar la Edge Function
  const funcRes = await fetch(
    'https://ocednvnbopromyirgqpn.supabase.co/functions/v1/upload-to-youtube',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filePath: fileName,
        title,
        description: description ?? '',
      }),
    },
  );

  if (!funcRes.ok) {
    const funcError = await funcRes.text();
    throw new Error(`Error enviando a YouTube: ${funcError}`);
  }

  const funcData = (await funcRes.json()) as { videoId: string; url: string };
  return funcData.url;
};
