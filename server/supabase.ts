import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { convertImageWithPython } from './imageConverter';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://peollhilachrsmjcxqtg.supabase.co';

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  'placeholder';

export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseServiceKey && supabaseServiceKey !== 'placeholder');
};

let clientInstance: SupabaseClient | null = null;
try {
  if (isSupabaseConfigured()) {
    clientInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
} catch (err) {
  console.error('Failed initializing Supabase client:', err);
}

export const supabaseAdmin: SupabaseClient =
  clientInstance ||
  createClient('https://peollhilachrsmjcxqtg.supabase.co', 'placeholder-key', {
    auth: { persistSession: false, autoRefreshToken: false }
  });

/**
 * Upload Base64 Data URL or Buffer to Supabase Cloud Storage bucket.
 * Automatically converts JPG/JPEG/PNG images to WebP format using Python script.
 * Returns public access URL.
 */
export async function uploadToSupabaseStorage(
  bucketName: string,
  fileName: string,
  base64Data: string
): Promise<string> {
  // Pass image through Python WebP converter first
  const processedData = await convertImageWithPython(base64Data);

  if (!isSupabaseConfigured()) {
    return processedData; // fallback to converted base64 data
  }

  try {
    // Parse Base64 data string (data:image/webp;base64,...)
    const matches = processedData.match(/^data:(.+);base64,(.+)$/);
    let buffer: Buffer;
    let contentType = 'image/webp';

    if (matches && matches.length === 3) {
      contentType = matches[1];
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(processedData, 'base64');
    }

    const webpFileName = fileName.replace(/\.[^/.]+$/, '') + '.webp';
    const cleanFileName = `${Date.now()}_${webpFileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // Ensure bucket exists or upload file
    const { error: uploadErr } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(cleanFileName, buffer, {
        contentType,
        upsert: true
      });

    if (uploadErr) {
      console.warn(`Supabase Storage upload error for bucket "${bucketName}":`, uploadErr.message);
      return processedData;
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(cleanFileName);

    return publicUrlData?.publicUrl || processedData;
  } catch (err) {
    console.error('Failed to upload file to Supabase Storage:', err);
    return processedData;
  }
}

