import aspose.slides as slides

def render():
    for name in ['webdings_grid', 'wingdings_grid']:
        pres = slides.Presentation(f'{name}.pptx')
        slide = pres.slides[0]
        image = slide.get_image(1.0, 1.0)
        image.save(f'{name}.png', slides.ImageFormat.PNG)
        print(f"Rendered {name}")

render()
