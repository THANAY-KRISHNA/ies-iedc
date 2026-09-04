import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseServiceKey);
};

export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

/**
 * Upload Base64 Data URL or Buffer to Supabase Cloud Storage bucket.
 * Returns public access URL.
 */
export async function uploadToSupabaseStorage(
  bucketName: string,
  fileName: string,
  base64Data: string
): Promise<string> {
  if (!isSupabaseConfigured()) {
    return base64Data; // fallback
  }

  try {
    // Parse Base64 data string (data:image/jpeg;base64,...)
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    let buffer: Buffer;
    let contentType = 'image/jpeg';

    if (matches && matches.length === 3) {
      contentType = matches[1];
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // Ensure bucket exists or upload file
    const { error: uploadErr } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(cleanFileName, buffer, {
        contentType,
        upsert: true
      });

    if (uploadErr) {
      console.warn(`Supabase Storage upload error for bucket "${bucketName}":`, uploadErr.message);
      return base64Data;
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(cleanFileName);

    return publicUrlData?.publicUrl || base64Data;
  } catch (err) {
    console.error('Failed to upload file to Supabase Storage:', err);
    return base64Data;
  }
}
