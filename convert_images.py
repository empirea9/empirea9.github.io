#!/usr/bin/env python3
"""
Image conversion and optimization script for Picasa gallery.
Converts images to WebP format, creates compressed versions, and generates smooth thumbnails.
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageFilter
    import pillow_avif
except ImportError:
    print("Installing required packages...")
    os.system(f"{sys.executable} -m pip install -q Pillow pillow-avif-plugin")
    from PIL import Image, ImageFilter

# Configuration
SOURCE_DIR = Path("assets")
TARGET_DIR = Path("photos")
THUMBNAIL_DIR = TARGET_DIR / "thumbnails"
THUMBNAIL_QUALITY = 55  # 55% quality for smoother thumbnails
FULL_QUALITY = 85  # 85% quality for full images
THUMBNAIL_MAX_SIZE = (400, 400)  # Max dimensions for thumbnails

# Create directories
TARGET_DIR.mkdir(exist_ok=True)
THUMBNAIL_DIR.mkdir(exist_ok=True)

def convert_image_to_webp(input_path, output_path, quality=85, max_size=None, smooth=False):
    """Convert an image to WebP format with specified quality."""
    try:
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create a white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize if max_size is specified
            if max_size:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Apply slight blur for smoothness (reduces sharpness)
            if smooth:
                img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
            
            # Save as WebP
            img.save(output_path, 'WEBP', quality=quality, method=6)
            return True
    except Exception as e:
        print(f"Error converting {input_path}: {e}")
        return False

def get_image_files(directory):
    """Get all image files from a directory."""
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.webp'}
    return [f for f in directory.iterdir() 
            if f.is_file() and f.suffix.lower() in image_extensions]

def main():
    print("Starting image conversion process...")
    print(f"Source: {SOURCE_DIR}")
    print(f"Target: {TARGET_DIR}")
    print(f"Thumbnails: {THUMBNAIL_DIR}")
    print("-" * 60)
    
    # Get all images from source directory
    images = get_image_files(SOURCE_DIR)
    total = len(images)
    
    if total == 0:
        print(f"No images found in {SOURCE_DIR}")
        return
    
    print(f"Found {total} images to process")
    print("-" * 60)
    
    converted_count = 0
    skipped_count = 0
    
    for idx, image_path in enumerate(images, 1):
        # Get filename without extension
        base_name = image_path.stem
        
        # Output paths
        full_output = TARGET_DIR / f"{base_name}.webp"
        thumb_output = THUMBNAIL_DIR / f"{base_name}.webp"
        
        print(f"[{idx}/{total}] Processing: {image_path.name}")
        
        # Convert full image
        if full_output.exists():
            print(f"  → Full image already exists, skipping")
            skipped_count += 1
        else:
            success = convert_image_to_webp(image_path, full_output, quality=FULL_QUALITY)
            if success:
                file_size = full_output.stat().st_size / 1024  # KB
                print(f"  ✓ Full image: {file_size:.1f} KB")
                converted_count += 1
            else:
                print(f"  ✗ Failed to convert full image")
                continue
        
        # Create thumbnail with smoothness
        if thumb_output.exists():
            print(f"  → Thumbnail already exists, regenerating with new settings")
            thumb_output.unlink()  # Remove old thumbnail
        
        success = convert_image_to_webp(
            image_path, thumb_output, 
            quality=THUMBNAIL_QUALITY, 
            max_size=THUMBNAIL_MAX_SIZE,
            smooth=True  # Apply smoothing to reduce sharpness
        )
        if success:
            file_size = thumb_output.stat().st_size / 1024  # KB
            print(f"  ✓ Thumbnail: {file_size:.1f} KB")
        else:
            print(f"  ✗ Failed to create thumbnail")
    
    print("-" * 60)
    print(f"Conversion complete!")
    print(f"  Converted: {converted_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"  Total processed: {total}")
    
    # Generate image list for HTML
    webp_images = sorted([f.name for f in TARGET_DIR.iterdir() 
                          if f.is_file() and f.suffix == '.webp'])
    
    print("-" * 60)
    print("Image paths for HTML (copy to picasa/index.html):")
    print("const imagePaths = [")
    for img in webp_images:
        print(f"  '../photos/{img}',")
    print("];")

if __name__ == "__main__":
    main()
