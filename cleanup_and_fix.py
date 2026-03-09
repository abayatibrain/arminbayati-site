#!/usr/bin/env python3
"""
Cleanup script to remove incorrect figure/figcaption wrappers from gallery images.
Gallery images should only have simple caption divs, not figure tags.
"""

import re
from pathlib import Path

def cleanup_gallery_images(filepath):
    """Remove figure wrapping from gallery images, keeping only the small caption div."""
    print(f"Cleaning: {filepath}")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    i = 0
    removed_count = 0

    while i < len(lines):
        line = lines[i]

        # Find gallery-thumb div with img
        if '<div class="gallery-thumb"' in line:
            # Look ahead for img tag and check if it's wrapped in figure
            j = i + 1
            while j < len(lines) and '</div>' not in lines[j]:
                if '<figure' in lines[j]:
                    # Found figure tag in gallery - this needs to be unwrapped
                    # Find the matching closing figure tag
                    figure_start = j
                    k = j + 1
                    while k < len(lines) and '</figure>' not in lines[k]:
                        k += 1
                    figure_end = k

                    if figure_end < len(lines):
                        # Extract the img tag and caption div from between <figure> and </figure>
                        img_line = None
                        caption_div = None

                        for m in range(figure_start + 1, figure_end):
                            if '<img' in lines[m]:
                                img_line = m
                            if '<div style="font-size:11px' in lines[m]:
                                caption_div = m

                        if img_line and caption_div:
                            # Remove the figure start and figcaption, keep img and small caption
                            # Remove figcaption line
                            for m in range(figure_start + 1, figure_end):
                                if '<figcaption' in lines[m]:
                                    del lines[m]
                                    figure_end -= 1
                                    break

                            # Remove figure end
                            if '</figure>' in lines[figure_end]:
                                del lines[figure_end]
                                removed_count += 1

                            # Remove figure start
                            if '<figure' in lines[figure_start]:
                                del lines[figure_start]
                                removed_count += 1

                        break
                j += 1
        i += 1

    new_content = '\n'.join(lines)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  Removed {removed_count} figure wrappers\n")

def main():
    base_path = Path('/sessions/vibrant-dreamy-lovelace/mnt/Cowork/arminbayati-site')

    target_files = [
        'ipscs.html',
        'cellular-assays.html',
        'genetics.html',
        'microscopy.html'
    ]

    for filename in target_files:
        filepath = base_path / filename
        if filepath.exists():
            cleanup_gallery_images(filepath)

    print("✓ Cleanup complete!")

if __name__ == '__main__':
    main()
