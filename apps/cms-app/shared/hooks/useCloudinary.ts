import { toast } from '@repo/ui/components';

interface UploadToCloudinaryParams {
  file: File;
  folder: string;
}

interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Sube una imagen a Cloudinary y devuelve la URL pública
 * @param params - Parámetros de carga (archivo, carpeta)
 * @returns Resultado de la carga con URL o error
 */
export const uploadToCloudinary = async ({
  file,
  folder,
}: UploadToCloudinaryParams): Promise<CloudinaryUploadResult> => {
  try {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return { success: false, error: 'File must be an image' };
    }

    // Obtener credenciales de Cloudinary desde variables de entorno
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error('Missing Cloudinary credentials');
      toast.error('Configuración de Cloudinary no encontrada');
      return { success: false, error: 'Missing Cloudinary configuration' };
    }

    // Crear FormData para Cloudinary
    // IMPORTANTE: el upload preset NO debe tener carpeta fija en el dashboard,
    // de lo contrario 'folder' se concatena al public_id en vez de crear la carpeta.
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    // Subir a Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error:', errorData);
      return {
        success: false,
        error: errorData.error?.message || 'Upload failed',
      };
    }
    const data = await response.json();
    return { success: true, url: data.secure_url };
  } catch (error) {
    console.error('Unexpected error in uploadToCloudinary:', error);
    toast.error('Error inesperado al procesar la imagen');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
