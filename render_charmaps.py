import aspose.slides as slides
import os

def render():
    for name in ['wingdings_charmap', 'webdings_charmap']:
        pres = slides.Presentation(f'{name}.pptx')
        os.makedirs('charmaps', exist_ok=True)
        # Render first slide
        slide = pres.slides[0]
        # Set large slide height so we can see all characters
        # Actually aspose get_image is fine.
        image = slide.get_image(1.0, 1.0)
        image.save(f'charmaps/{name}.png', slides.ImageFormat.PNG)
        print(f"Rendered {name}")

render()
