#!/usr/bin/env python3
"""
Validation script to verify all images have appropriate captions.
"""

import re
from pathlib import Path

def validate_file(filepath):
    """Validate that all images in a file have appropriate captions."""
    print(f"\nValidating: {filepath.name}")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

    # Find all images
    images_found = []
    for i, line in enumerate(lines):
        if '<img' in line and 'src=' in line:
            src_match = re.search(r'src=["\']([^"\']+)["\']', line)
            if src_match:
                filename = Path(src_match.group(1)).name
                # Check context
                is_gallery = any('gallery-thumb' in lines[j] for j in range(max(0, i-3), i+1))

                # For standalone, check above for figure tag
                has_figure = any('<figure' in lines[j] for j in range(max(0, i-2), i))
                has_figcaption = any('<figcaption' in lines[j] for j in range(i, min(len(lines), i+3)))

                # For gallery, check near img for caption div
                has_div_caption = any('font-size:11px' in lines[j] and 'padding:4px' in lines[j] for j in range(max(0, i-2), min(len(lines), i+2)))

                images_found.append({
                    'filename': filename,
                    'line': i + 1,
                    'is_gallery': is_gallery,
                    'has_figure': has_figure,
                    'has_figcaption': has_figcaption,
                    'has_div_caption': has_div_caption,
                    'full_tag': line.strip()
                })

    # Validate each image
    missing_captions = []
    for img in images_found:
        if img['is_gallery']:
            if not img['has_div_caption']:
                missing_captions.append(f"Gallery image '{img['filename']}' (line {img['line']}) missing caption div")
        else:
            if not img['has_figure'] or not img['has_figcaption']:
                missing_captions.append(f"Standalone image '{img['filename']}' (line {img['line']}) missing figure/figcaption")

    # Report
    print(f"  Total images: {len(images_found)}")
    print(f"  - Standalone with figcaption: {sum(1 for img in images_found if not img['is_gallery'] and img['has_figure'] and img['has_figcaption'])}")
    print(f"  - Gallery with caption div: {sum(1 for img in images_found if img['is_gallery'] and img['has_div_caption'])}")

    if missing_captions:
        print(f"\n  ⚠ Missing captions:")
        for msg in missing_captions:
            print(f"    - {msg}")
        return False
    else:
        print(f"  ✓ All images have captions")
        return True

def main():
    base_path = Path('/sessions/vibrant-dreamy-lovelace/mnt/Cowork/arminbayati-site')

    target_files = [
        'ipscs.html',
        'cellular-assays.html',
        'genetics.html',
        'drug-discovery.html',
        'microscopy.html',
        'coding.html'
    ]

    all_valid = True
    for filename in target_files:
        filepath = base_path / filename
        if filepath.exists():
            if not validate_file(filepath):
                all_valid = False
        else:
            print(f"Warning: {filepath} not found")

    print("\n" + "="*60)
    if all_valid:
        print("✓ All files validated successfully!")
    else:
        print("⚠ Some files have missing captions")

if __name__ == '__main__':
    main()
