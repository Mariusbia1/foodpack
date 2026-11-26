import os
from PIL import Image, ImageDraw, ImageFont

def render_fp_icon(size, corner_ratio=0.22):
    # Create RGBA image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Black background with smooth luxury rounded corners
    radius = int(size * corner_ratio)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill='#000000')

    # Font setup
    font_path = '/System/Library/Fonts/Supplemental/Arial Black.ttf'
    font_size = int(size * 0.46)
    font = ImageFont.truetype(font_path, font_size)

    text = 'FP'
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    # Red period dot
    dot_size = max(2, int(size * 0.085))
    spacing = max(1, int(size * 0.025))

    total_w = tw + spacing + dot_size
    start_x = (size - total_w) // 2
    y = (size - th) // 2 - int(size * 0.015)

    # Draw 'FP' in pure white
    draw.text((start_x - bbox[0], y - bbox[1]), text, fill='#FFFFFF', font=font)

    # Draw red square dot aligned to the text baseline
    dot_x = start_x + tw + spacing
    dot_y = y + th - dot_size - int(size * 0.015)
    draw.rectangle([dot_x, dot_y, dot_x + dot_size, dot_y + dot_size], fill='#FF3333')

    return img


def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pub_dir = os.path.join(base_dir, 'public')

    # PNG icons for various standards
    sizes = {
        'favicon-16x16.png': 16,
        'favicon-32x32.png': 32,
        'favicon-48x48.png': 48,    # Crucial for Google Favicon bot
        'favicon-96x96.png': 96,    # High-DPI search engines
        'apple-touch-icon.png': 180, # iOS and Safari
        'app-icon-192.png': 192,    # PWA & Google Android Search
        'app-icon-512.png': 512,    # PWA High-res & Schema.org Logo
        'og-icon-square.png': 512,
    }

    for fname, sz in sizes.items():
        img = render_fp_icon(sz)
        out_path = os.path.join(pub_dir, fname)
        img.save(out_path, 'PNG', optimize=True)
        print(f"Generated {fname} ({sz}x{sz}): {os.path.getsize(out_path)} bytes")

    # Generate multi-resolution favicon.ico (16, 32, 48)
    ico_img = render_fp_icon(48)
    ico_path = os.path.join(pub_dir, 'favicon.ico')
    ico_img.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"Generated favicon.ico (16/32/48): {os.path.getsize(ico_path)} bytes")

    # Generate matching app-icon.svg
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#000000"/>
  <text x="215" y="325" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="210" font-weight="900" fill="#FFFFFF" letter-spacing="-8">FP</text>
  <rect x="345" y="285" width="42" height="42" rx="4" fill="#FF3333"/>
</svg>'''
    svg_path = os.path.join(pub_dir, 'app-icon.svg')
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"Generated app-icon.svg: {os.path.getsize(svg_path)} bytes")

    print("\nAll brand icons generated successfully!")


if __name__ == '__main__':
    main()
