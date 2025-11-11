import { supabase } from './supabase';

export type BucketName = 'videos' | 'images' | 'avatars' | 'banners';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export async function uploadFile(
  bucket: BucketName,
  file: File,
  userId: string,
  folder?: string
): Promise<UploadResult> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${userId}/${folder}/${fileName}` : `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return {
      url: '',
      path: '',
      error: error.message || 'Upload failed',
    };
  }
}

export async function deleteFile(bucket: BucketName, path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

export function getPublicUrl(bucket: BucketName, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function updateFile(
  bucket: BucketName,
  file: File,
  existingPath: string
): Promise<UploadResult> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .update(existingPath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(existingPath);

    return {
      url: urlData.publicUrl,
      path: existingPath,
    };
  } catch (error: any) {
    console.error('Update error:', error);
    return {
      url: '',
      path: '',
      error: error.message || 'Update failed',
    };
  }
}

export function validateFileSize(file: File, bucket: BucketName): boolean {
  const limits: Record<BucketName, number> = {
    videos: 524288000, // 500MB
    images: 10485760, // 10MB
    avatars: 2097152, // 2MB
    banners: 5242880, // 5MB
  };

  return file.size <= limits[bucket];
}

export function validateFileType(file: File, bucket: BucketName): boolean {
  const allowedTypes: Record<BucketName, string[]> = {
    videos: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
    images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    avatars: ['image/jpeg', 'image/png', 'image/webp'],
    banners: ['image/jpeg', 'image/png', 'image/webp'],
  };

  return allowedTypes[bucket].includes(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
