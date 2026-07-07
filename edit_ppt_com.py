import win32com.client
import re
import os
import time

def rgb(r, g, b):
    return r + (g * 256) + (b * 65536)

ACCENTURE_PURPLE = rgb(161, 0, 255)
DARK_GRAY = rgb(64, 64, 64)
WHITE = rgb(255, 255, 255)

def fix_presentation():
    print("Starting PowerPoint...")
    try:
        ppt = win32com.client.Dispatch("PowerPoint.Application")
        ppt.DisplayAlerts = 2 # ppAlertsNone
        # Don't make it visible if we don't have to, but sometimes it's required for certain operations.
        # ppt.Visible = True 
    except Exception as e:
        print("Failed to dispatch PPT:", e)
        return

    prs = None
    try:
        print("Opening presentation...")
        prs = ppt.Presentations.Open('C:\\Mortgage Calculator\\ServiceNow_x_Accenture_Virtual_Agent.pptx', WithWindow=False)
        
        # 1. Slide 10: Leftover note & left banner overlap
        print("Fixing Slide 10...")
        slide10 = prs.Slides(10)
        shapes_to_delete = []
        for shp in slide10.Shapes:
            if shp.HasTextFrame and shp.TextFrame.HasText:
                txt = shp.TextFrame.TextRange.Text
                if "Reference-inspired layout" in txt or "Built with purpose" in txt:
                    shapes_to_delete.append(shp)
        for shp in shapes_to_delete:
            shp.Delete()

        tb = slide10.Shapes.AddTextbox(1, 100, 450, 700, 50) # msoTextOrientationHorizontal = 1
        tb.TextFrame.TextRange.Text = "Ready to accelerate your IT support transformation."
        tb.TextFrame.TextRange.Font.Size = 24
        tb.TextFrame.TextRange.Font.Color.RGB = ACCENTURE_PURPLE

        # Strip underlines
        print("Stripping partial underlines...")
        for slide in prs.Slides:
            for shp in slide.Shapes:
                if shp.HasTextFrame and shp.TextFrame.HasText:
                    for run in shp.TextFrame.TextRange.Runs():
                        run.Font.Underline = 0 # msoFalse

        # 2 & 10. Remove bare "Karteek Tadimalla" and purple bottom bar
        print("Removing bare footer and bottom bar...")
        for slide in prs.Slides:
            to_delete = []
            for shp in slide.Shapes:
                if shp.HasTextFrame and shp.TextFrame.HasText:
                    txt = shp.TextFrame.TextRange.Text.strip()
                    if txt == "Karteek Tadimalla" or " | " in txt:
                        to_delete.append(shp)
                # Check for purple bottom bar (wide rectangle near bottom)
                if shp.Type == 1: # msoAutoShape
                    if shp.Width > 700 and shp.Top > 450:
                        to_delete.append(shp)
            for shp in to_delete:
                shp.Delete()

        # 6. Split Slide 2
        print("Splitting Slide 2...")
        slide2 = prs.Slides(2)
        slide3 = slide2.Duplicate()
        slide3.MoveTo(3) # Ensure it is index 3
        
        to_del_2 = []
        to_del_3 = []
        for shp in prs.Slides(2).Shapes:
            if shp.Top > 250: # bottom boxes
                to_del_2.append(shp)
        for shp in prs.Slides(3).Shapes:
            if shp.Top < 200: # top boxes
                to_del_3.append(shp)
        for shp in to_del_2:
            shp.Delete()
        for shp in to_del_3:
            shp.Delete()
            
        for shp in prs.Slides(3).Shapes:
            shp.Top = shp.Top - 150
            
        tb = prs.Slides(3).Shapes.AddTextbox(1, 50, 20, 800, 50)
        tb.TextFrame.TextRange.Text = "Proposed Solution"
        tb.TextFrame.TextRange.Font.Size = 32
        tb.TextFrame.TextRange.Font.Bold = -1 # msoTrue

        # 7. Fix Architecture diagram on Slide 4 (was 3)
        print("Fixing Architecture diagram...")
        slide4 = prs.Slides(4)
        for shp in slide4.Shapes:
            if shp.HasTextFrame and shp.TextFrame.HasText:
                txt = shp.TextFrame.TextRange.Text
                if "Virtual Agent Chat" in txt: shp.Left += 20
                if "Employee Portal" in txt: shp.Left += 40
                if "AI Orchestration" in txt: shp.Left += 60
                if "Custom AI Agent" in txt: shp.Left += 80
                if "Notifications" in txt: shp.Left += 20
                if "Auto-Assignment" in txt: shp.Left += 40
                if "ITSM Automation" in txt: shp.Left += 60
                if "KB Lookup" in txt: shp.Left += 80
                if "Architecture Notes" in txt: shp.Top -= 30

        # 3. Boilerplate captions
        print("Fixing boilerplate captions...")
        slide7 = prs.Slides(7)
        caps = [shp for shp in slide7.Shapes if shp.HasTextFrame and shp.TextFrame.HasText and "Higher consistency and faster response" in shp.TextFrame.TextRange.Text]
        caps.sort(key=lambda x: x.Left)
        r7 = ["Instant 24/7 Support", "Zero-Touch Routing", "Scalable Automation"]
        for i, shp in enumerate(caps):
            if i < len(r7): shp.TextFrame.TextRange.Text = r7[i]

        slide8 = prs.Slides(8)
        caps = [shp for shp in slide8.Shapes if shp.HasTextFrame and shp.TextFrame.HasText and "Self-service" in shp.TextFrame.TextRange.Text and "Escalation" in shp.TextFrame.TextRange.Text]
        caps.sort(key=lambda x: x.Left)
        r8 = ["Guided Assistance", "Knowledge Deflection", "Automated Ticketing", "Seamless Follow-up"]
        for i, shp in enumerate(caps):
            if i < len(r8): shp.TextFrame.TextRange.Text = r8[i]

        slide9 = prs.Slides(9)
        caps = [shp for shp in slide9.Shapes if shp.HasTextFrame and shp.TextFrame.HasText and "Design for iteration and scale" in shp.TextFrame.TextRange.Text]
        caps.sort(key=lambda x: x.Left)
        r9 = ["Wider Reach", "Cross-Domain Support", "Autonomous IT"]
        for i, shp in enumerate(caps):
            if i < len(r9): shp.TextFrame.TextRange.Text = r9[i]

        # 4. Text codes to shapes
        print("Changing text codes to native shapes...")
        for slide in prs.Slides:
            for shp in slide.Shapes:
                if shp.Type == 1 and shp.AutoShapeType == 9: # Oval
                    if shp.HasTextFrame and shp.TextFrame.HasText:
                        txt = shp.TextFrame.TextRange.Text.strip()
                        if len(txt) <= 3 and txt.isupper():
                            shp.TextFrame.TextRange.Text = ""
                            shp.AutoShapeType = 24 # msoShapeBevel
                            tb = slide.Shapes.AddTextbox(1, shp.Left - 10, shp.Top + shp.Height, shp.Width + 20, 20)
                            tb.TextFrame.TextRange.Text = txt
                            tb.TextFrame.TextRange.Font.Size = 10

        # 5. Colors & Backgrounds
        print("Updating color palette and dark slides...")
        for i, slide in enumerate(prs.Slides):
            slide_idx = i + 1
            if slide_idx in [1, 11]:
                slide.Background.Fill.ForeColor.RGB = ACCENTURE_PURPLE
                for shp in slide.Shapes:
                    if shp.HasTextFrame and shp.TextFrame.HasText:
                        shp.TextFrame.TextRange.Font.Color.RGB = WHITE
            
            for shp in slide.Shapes:
                try:
                    if shp.Fill.Visible and shp.Fill.ForeColor.RGB not in [WHITE, DARK_GRAY]:
                        shp.Fill.ForeColor.RGB = ACCENTURE_PURPLE
                except:
                    pass

        # 9. Renumbering cascade & proper footer
        print("Adding footers and updating chip badges...")
        for i, slide in enumerate(prs.Slides):
            slide_idx = i + 1
            tb = slide.Shapes.AddTextbox(1, 750, 500, 150, 30)
            tb.TextFrame.TextRange.Text = f"Karteek Tadimalla | Slide {slide_idx}"
            tb.TextFrame.TextRange.Font.Size = 10
            tb.TextFrame.TextRange.Font.Color.RGB = DARK_GRAY if slide_idx not in [1, 11] else WHITE

            for shp in slide.Shapes:
                if shp.HasTextFrame and shp.TextFrame.HasText:
                    txt = shp.TextFrame.TextRange.Text.strip()
                    if re.match(r'^0?\d$', txt):
                        shp.TextFrame.TextRange.Text = f"{slide_idx:02d}"

        out_path = 'C:\\Mortgage Calculator\\ServiceNow_x_Accenture_Virtual_Agent_fixed.pptx'
        print(f"Saving to {out_path}...")
        prs.SaveAs(out_path)
        print("Done successfully.")

    except Exception as e:
        print("Error during execution:", e)
        traceback.print_exc()
    finally:
        if prs:
            try: prs.Close()
            except: pass
        try: ppt.Quit()
        except: pass

if __name__ == '__main__':
    fix_presentation()
