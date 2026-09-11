import sys
import os
import io
import base64
from PIL import Image

def convert_to_webp(input_path, output_path=None, quality=82, max_size=1600):
    """
    Converts any JPG/JPEG/PNG image file to WebP format to save memory.
    Resizes image if width or height exceeds max_size.
    """
    if not os.path.exists(input_path):
        print(f"Error: Input file '{input_path}' not found.", file=sys.stderr)
        sys.exit(1)

    if not output_path:
        base_name = os.path.splitext(input_path)[0]
        output_path = f"{base_name}.webp"

    try:
        with Image.open(input_path) as img:
            # Convert RGB mode if needed (RGBA or Palette)
            if img.mode in ("RGBA", "P") and "transparency" in img.info:
                img = img.convert("RGBA")
            elif img.mode != "RGB":
                img = img.convert("RGB")

            # Resize if oversized while maintaining aspect ratio
            width, height = img.size
            if width > max_size or height > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

            # Save as WebP
            img.save(output_path, "WEBP", quality=quality, method=4)
            print(f"Converted: {input_path} -> {output_path} ({os.path.getsize(output_path)} bytes)")
            return output_path
    except Exception as e:
        print(f"Error converting image to WebP: {e}", file=sys.stderr)
        sys.exit(1)

def convert_base64_to_webp(base64_str, quality=82, max_size=1600):
    """
    Converts a base64 encoded JPG/PNG string to WebP base64 data URL.
    """
    try:
        if "," in base64_str:
            base64_data = base64_str.split(",", 1)[1]
        else:
            base64_data = base64_str

        img_bytes = base64.b64decode(base64_data)
        with Image.open(io.BytesIO(img_bytes)) as img:
            if img.mode in ("RGBA", "P") and "transparency" in img.info:
                img = img.convert("RGBA")
            elif img.mode != "RGB":
                img = img.convert("RGB")

            width, height = img.size
            if width > max_size or height > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)

            out_buffer = io.BytesIO()
            img.save(out_buffer, "WEBP", quality=quality, method=4)
            out_bytes = out_buffer.getvalue()
            out_b64 = base64.b64encode(out_bytes).decode("utf-8")
            return f"data:image/webp;base64,{out_b64}"
    except Exception as e:
        print(f"Error in base64 conversion: {e}", file=sys.stderr)
        return base64_str

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert_image.py <input_file_or_base64> [output_file] [quality]")
        sys.exit(1)

    arg = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    quality_val = int(sys.argv[3]) if len(sys.argv) > 3 else 82

    if arg.startswith("data:image/") or len(arg) > 500:
        # Base64 string conversion mode
        res_b64 = convert_base64_to_webp(arg, quality=quality_val)
        print(res_b64)
    else:
        convert_to_webp(arg, output_file, quality=quality_val)
