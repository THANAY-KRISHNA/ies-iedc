import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

/**
 * Server-side Python Image Converter.
 * Takes a Base64 Data URL or raw Base64 string of a photo (JPG/PNG/JPEG)
 * and executes Python script `scripts/convert_image.py` using PIL/Pillow
 * to convert it to high-efficiency WebP format (.webp) before DB or Cloud storage saving.
 */
export async function convertImageWithPython(base64Data: string): Promise<string> {
  if (!base64Data || typeof base64Data !== 'string') {
    return base64Data;
  }

  // If already WebP or not a photo Data URL / base64 string, return unchanged
  if (base64Data.startsWith('data:image/webp;')) {
    return base64Data;
  }

  // Only attempt conversion if it looks like an image data URL or base64 payload
  const isImageDataUrl = base64Data.startsWith('data:image/');
  const isBase64String = base64Data.length > 100 && /^[A-Za-z0-9+/=,\s]+$/.test(base64Data.slice(0, 500));

  if (!isImageDataUrl && !isBase64String) {
    return base64Data;
  }

  const scriptPath = path.join(process.cwd(), 'scripts', 'convert_image.py');
  if (!fs.existsSync(scriptPath)) {
    console.warn('[Python Converter] scripts/convert_image.py not found, skipping Python conversion.');
    return base64Data;
  }

  // Create unique temporary file paths
  const timestamp = Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const tempDir = os.tmpdir();
  const tempInputPath = path.join(tempDir, `upload_input_${timestamp}.tmp`);
  const tempOutputPath = path.join(tempDir, `upload_output_${timestamp}.webp`);

  try {
    // Extract binary buffer from Base64
    let rawBase64 = base64Data;
    if (base64Data.includes(',')) {
      rawBase64 = base64Data.split(',')[1];
    }
    const inputBuffer = Buffer.from(rawBase64, 'base64');
    await fs.promises.writeFile(tempInputPath, inputBuffer);

    // Python launcher detection ('py' on Windows, 'python3' or 'python' on Linux/Mac)
    const pythonCmd = process.platform === 'win32' ? 'py' : 'python3';

    // Execute Python script to convert image to WebP
    await execFileAsync(pythonCmd, [scriptPath, tempInputPath, tempOutputPath, '82']);

    if (fs.existsSync(tempOutputPath)) {
      const webpBuffer = await fs.promises.readFile(tempOutputPath);
      const webpBase64 = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
      console.log(`[Python Image Converter] Successfully converted image to WebP (Input: ${inputBuffer.length} bytes -> Output: ${webpBuffer.length} bytes)`);
      return webpBase64;
    }
  } catch (err: any) {
    console.warn('[Python Image Converter] Execution failed, using original file data:', err.message || err);
  } finally {
    // Clean up temporary files
    try {
      if (fs.existsSync(tempInputPath)) await fs.promises.unlink(tempInputPath);
      if (fs.existsSync(tempOutputPath)) await fs.promises.unlink(tempOutputPath);
    } catch {}
  }

  return base64Data;
}
