import aspose.slides as slides
import os

def render_fixed_slides():
    ppt_path = r'C:\Users\karte\Downloads\ServiceNow_x_Accenture_Virtual_Agent.pptx'
    output_dir = r'C:\Users\karte\.gemini\antigravity\brain\0a078694-4909-479d-8049-693efff6d28f\scratch\fixed_downloads_slides'
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Loading presentation {ppt_path}...")
    pres = slides.Presentation(ppt_path)
    print(f"Loaded. Rendering {pres.slides.length} slides...")
    for i in range(pres.slides.length):
        slide = pres.slides[i]
        image = slide.get_image(1.0, 1.0)
        dest = os.path.join(output_dir, f'slide_{i+1}.png')
        image.save(dest, slides.ImageFormat.PNG)
        print(f"Rendered slide {i+1} to {dest}")
    print("Done rendering!")

if __name__ == '__main__':
    render_fixed_slides()
