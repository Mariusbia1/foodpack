import os
from PIL import Image, ImageDraw, ImageFont

def generate_pro_banner():
    width = 1200
    height = 630
    
    # 1. Base Image - Crisp, Clean Luxury Studio White/Warm Grey
    img = Image.new('RGB', (width, height), color='#FFFFFF')
    draw = ImageDraw.Draw(img)
    
    # Background subtle framing
    # Light gray container on the right for products
    draw.rounded_rectangle([660, 30, 1170, 600], radius=28, fill='#F4F3F0', outline='#E6E4DF', width=2)
    
    # Fonts
    font_bold_path = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
    font_reg_path = '/System/Library/Fonts/Supplemental/Arial.ttf'
    font_black_path = '/System/Library/Fonts/Supplemental/Arial Black.ttf'
    
    font_badge = ImageFont.truetype(font_bold_path, 15)
    font_title_main = ImageFont.truetype(font_black_path, 54)
    font_title_sub = ImageFont.truetype(font_bold_path, 34)
    font_desc = ImageFont.truetype(font_bold_path, 21)
    font_pills = ImageFont.truetype(font_bold_path, 16)
    font_url = ImageFont.truetype(font_bold_path, 19)
    
    # --- LEFT SIDE CONTENT ---
    # Top Category Tag
    draw.rounded_rectangle([50, 48, 480, 84], radius=18, fill='#000000')
    draw.text((70, 56), "GROSSISTE EMBALLAGES ALIMENTAIRES", fill='#FFFFFF', font=font_badge)
    
    # Brand Name
    draw.text((50, 115), "FOODPACK", fill='#000000', font=font_title_main)
    # Red dot accent
    draw.text((375, 115), ".", fill='#FF3333', font=font_title_main)
    
    draw.text((52, 178), "by Maurelle", fill='#555555', font=font_title_sub)
    
    # Fine separator line
    draw.line([52, 235, 600, 235], fill='#E5E7EB', width=2)
    
    # Core Value Proposition / Products text
    draw.text((52, 260), "Bouteilles PET cristal inviolables pour bissap & jus", fill='#111827', font=font_desc)
    draw.text((52, 298), "Boîtes repas kraft 100% étanches & anti-graisse", fill='#111827', font=font_desc)
    draw.text((52, 336), "Barquettes micro-ondables & contenants traiteur", fill='#111827', font=font_desc)
    
    # Trust Badges (Pills)
    # Pill 1: Vente en gros & demi-gros
    draw.rounded_rectangle([52, 395, 310, 435], radius=20, fill='#F3F4F6', outline='#E5E7EB', width=1)
    draw.text((70, 404), "📦 Vente en Gros & Détail", fill='#1F2937', font=font_pills)
    
    # Pill 2: Cotonou & Parakou
    draw.rounded_rectangle([320, 395, 595, 435], radius=20, fill='#F3F4F6', outline='#E5E7EB', width=1)
    draw.text((338, 404), "📍 Cotonou & Parakou (Bénin)", fill='#1F2937', font=font_pills)
    
    # Pill 3: Expédition rapide
    draw.rounded_rectangle([52, 450, 310, 490], radius=20, fill='#ECFDF5', outline='#A7F3D0', width=1)
    draw.text((70, 459), "⚡ Livraison Express 24/48h", fill='#065F46', font=font_pills)
    
    # Pill 4: Qualité certifiée
    draw.rounded_rectangle([320, 450, 595, 490], radius=20, fill='#EFF6FF', outline='#BFDBFE', width=1)
    draw.text((338, 459), "🛡️ Qualité Contact Alimentaire", fill='#1E40AF', font=font_pills)
    
    # Bottom URL Bar
    draw.rounded_rectangle([52, 530, 450, 580], radius=25, fill='#000000')
    draw.text((75, 542), "🌐 www.maurellefoodpack.store", fill='#FFFFFF', font=font_url)
    
    # --- RIGHT SIDE REAL PRODUCTS ---
    # Load and compose real product images
    # 1. Main PET Bottle
    pet_img = Image.open('public/products/bouteille-pet.jpg').convert('RGBA')
    pet_img = pet_img.resize((230, 230), Image.Resampling.LANCZOS)
    
    # 2. Kraft Box
    kraft_img = Image.open('public/products/boite-kraft.jpg').convert('RGBA')
    kraft_img = kraft_img.resize((230, 230), Image.Resampling.LANCZOS)
    
    # 3. Barquette Micro
    barq_img = Image.open('public/products/barquette-micro.jpg').convert('RGBA')
    barq_img = barq_img.resize((230, 230), Image.Resampling.LANCZOS)
    
    # 4. Bidon Alimentaire
    bidon_img = Image.open('public/products/bidon-alimentaire.jpg').convert('RGBA')
    bidon_img = bidon_img.resize((230, 230), Image.Resampling.LANCZOS)
    
    # Helper to paste rounded image card
    def paste_card(im, pos, label):
        x, y = pos
        # Card background with border
        draw.rounded_rectangle([x, y, x + 234, y + 260], radius=20, fill='#FFFFFF', outline='#E5E7EB', width=1)
        # Paste product
        img.paste(im, (x + 2, y + 2), im)
        # Label underneath
        draw.text((x + 20, y + 235), label, fill='#4B5563', font=ImageFont.truetype(font_bold_path, 13))
        
    paste_card(pet_img, (685, 55), "Bouteilles PET Cristal")
    paste_card(kraft_img, (925, 55), "Boîtes Repas Kraft")
    paste_card(barq_img, (685, 325), "Barquettes Micro-ondes")
    paste_card(bidon_img, (925, 325), "Bidons de Jus & Bissap")
    
    # Subtle outer border for the entire 1200x630 canvas
    draw.rectangle([0, 0, width - 1, height - 1], outline='#E5E7EB', width=1)
    
    # Save to all target locations
    out_paths = [
        'public/foodpack-banner-pro.png',
        'public/foodpack-by-maurelle-banner.png',
        'public/og-image.png',
        'public/foodpack-share.png',
        'public/brand-cover.png'
    ]
    
    for p in out_paths:
        img.save(p, 'PNG', optimize=True)
        print(f"Saved: {p} ({os.path.getsize(p)} bytes)")

generate_pro_banner()
