import os
from PIL import Image, ImageDraw, ImageFont


def generate_pro_banner():
    width = 1200
    height = 630

    # Clean, high-contrast minimalist white canvas
    img = Image.new('RGB', (width, height), color='#FFFFFF')
    draw = ImageDraw.Draw(img)

    # Subtle outer frame & bottom accent bar
    draw.rectangle([0, 0, width - 1, height - 1], outline='#E5E7EB', width=2)
    draw.rectangle([0, height - 16, width, height], fill='#000000')
    draw.rectangle([0, height - 16, 260, height], fill='#FF3333')

    font_bold_path = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
    font_black_path = '/System/Library/Fonts/Supplemental/Arial Black.ttf'

    font_logo = ImageFont.truetype(font_black_path, 128)
    font_sub = ImageFont.truetype(font_bold_path, 44)
    font_tag = ImageFont.truetype(font_bold_path, 26)
    font_url = ImageFont.truetype(font_bold_path, 22)

    # Centered brand mark: FOODPACK.
    brand_text = "FOODPACK"
    dot_text = "."

    brand_bbox = draw.textbbox((0, 0), brand_text, font=font_logo)
    dot_bbox = draw.textbbox((0, 0), dot_text, font=font_logo)
    brand_w = brand_bbox[2] - brand_bbox[0]
    dot_w = dot_bbox[2] - dot_bbox[0]
    total_w = brand_w + dot_w

    start_x = (width - total_w) // 2
    logo_y = 145
    draw.text((start_x, logo_y), brand_text, fill='#000000', font=font_logo)
    draw.text((start_x + brand_w + 4, logo_y), dot_text, fill='#FF3333', font=font_logo)

    # Centered "BY MAURELLE"
    sub_text = "BY MAURELLE"
    sub_bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    sub_w = sub_bbox[2] - sub_bbox[0]
    draw.text(((width - sub_w) // 2, 300), sub_text, fill='#555555', font=font_sub)

    # Clean divider
    draw.line([(width // 2) - 90, 382, (width // 2) + 90, 382], fill='#E5E7EB', width=3)

    # Simple clear tagline
    tag_text = "Emballages alimentaires professionnels · Bénin"
    tag_bbox = draw.textbbox((0, 0), tag_text, font=font_tag)
    tag_w = tag_bbox[2] - tag_bbox[0]
    draw.text(((width - tag_w) // 2, 415), tag_text, fill='#111111', font=font_tag)

    # Clean pill URL
    url_text = "www.maurellefoodpack.store"
    url_bbox = draw.textbbox((0, 0), url_text, font=font_url)
    url_w = url_bbox[2] - url_bbox[0]
    pill_w = url_w + 64
    pill_x = (width - pill_w) // 2
    draw.rounded_rectangle([pill_x, 485, pill_x + pill_w, 535], radius=25, fill='#000000')
    draw.text(((width - url_w) // 2, 497), url_text, fill='#FFFFFF', font=font_url)

    out_paths = [
        'public/foodpack-banner-pro.png',
        'public/foodpack-by-maurelle-banner.png',
        'public/og-image.png',
        'public/foodpack-share.png',
        'public/brand-cover.png',
    ]

    for p in out_paths:
        img.save(p, 'PNG', optimize=True)
        print(f"Saved: {p} ({os.path.getsize(p)} bytes)")


if __name__ == '__main__':
    generate_pro_banner()
