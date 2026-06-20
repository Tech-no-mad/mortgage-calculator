import json
import os
import time
import requests

states_file = r'c:\Mortgage Calculator\src\data\states.json'
images_dir = r'c:\Mortgage Calculator\public\images\states'

with open(states_file, 'r', encoding='utf-8') as f:
    statesData = json.load(f)

for s in statesData:
    if 'http' in s['heroImage'] and 'unsplash' not in s['heroImage']:
        img_url = s['heroImage']
        print(f"Downloading {s['name']} from {img_url}...")
        
        try:
            r = requests.get(img_url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Referer": "https://commons.wikimedia.org/"
            }, stream=True)
            
            if r.status_code == 200:
                filepath = os.path.join(images_dir, f"{s['slug']}.jpg")
                with open(filepath, 'wb') as out_file:
                    for chunk in r.iter_content(1024):
                        out_file.write(chunk)
                
                s['heroImage'] = f"/images/states/{s['slug']}.jpg"
                print(f"Successfully downloaded {s['name']}")
            else:
                print(f"Failed to download {s['name']} with status {r.status_code}")
                
        except Exception as e:
            print(f"Exception for {s['name']}: {e}")
            
        time.sleep(5)

with open(states_file, 'w', encoding='utf-8') as f:
    json.dump(statesData, f, indent=2)

print("Done")
