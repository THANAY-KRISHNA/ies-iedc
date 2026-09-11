/**
 * Client-side & Web Image Converter Utility
 * Automatically converts any uploaded JPG, JPEG, or PNG image file into WebP (.webp) format.
 * Reduces file payload size by up to 80% to save memory and bandwidth.
 */

export interface ImageConversionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/jpeg';
}

/**
 * Converts a File or Data URL string to WebP Data URL format.
 */
export async function convertToWebP(
  fileOrDataUrl: File | string,
  options: ImageConversionOptions = {}
): Promise<{ dataUrl: string; file?: File }> {
  const maxWidth = options.maxWidth || 1600;
  const maxHeight = options.maxHeight || 1600;
  const quality = options.quality || 0.82;

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate aspect-ratio-preserved dimensions
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Create offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D canvas context'));
        return;
      }

      // Draw image onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to WebP format
      const webpDataUrl = canvas.toDataURL('image/webp', quality);

      // If original was a File, also convert to WebP File instance
      if (fileOrDataUrl instanceof File) {
        canvas.toBlob(
          blob => {
            if (blob) {
              const cleanName = fileOrDataUrl.name.replace(/\.[^/.]+$/, '') + '.webp';
              const webpFile = new File([blob], cleanName, { type: 'image/webp' });
              resolve({ dataUrl: webpDataUrl, file: webpFile });
            } else {
              resolve({ dataUrl: webpDataUrl });
            }
          },
          'image/webp',
          quality
        );
      } else {
        resolve({ dataUrl: webpDataUrl });
      }
    };

    img.onerror = err => {
      reject(new Error(`Failed loading image for WebP conversion: ${err}`));
    };

    if (fileOrDataUrl instanceof File) {
      const reader = new FileReader();
      reader.onload = e => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    } else {
      img.src = fileOrDataUrl;
    }
  });
}
