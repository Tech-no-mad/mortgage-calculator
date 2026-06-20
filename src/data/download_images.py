import json
import requests
import time
import os

states_file = r'c:\Mortgage Calculator\src\data\states.json'
img_dir = r'c:\Mortgage Calculator\public\images\states'

os.makedirs(img_dir, exist_ok=True)

with open(states_file, 'r', encoding='utf-8') as f:
    states = json.load(f)

for s in states:
    url = s.get('heroImage')
    if not url or url.startswith('/images/states/'):
        continue
    
    # We want to download the image
    filename = s['name'].replace(' ', '_').lower() + '.jpg'
    filepath = os.path.join(img_dir, filename)
    
    if not os.path.exists(filepath):
        print(f"Downloading {s['name']} from {url}")
        try:
            r = requests.get(url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Referer": "https://commons.wikimedia.org/"
            }, stream=True)
            if r.status_code == 200:
                with open(filepath, 'wb') as out_file:
                    for chunk in r.iter_content(1024):
                        out_file.write(chunk)
                
                # Update JSON data with new local path
                s['heroImage'] = f"/images/states/{s['slug']}.jpg"
                time.sleep(3)
            else:
                print(f"Failed {s['name']}: {r.status_code}")
                time.sleep(3)
        except Exception as e:
            print(f"Exception {s['name']}: {e}")
        time.sleep(1) # prevent 429
    else:
        s['heroImage'] = f'/images/states/{filename}'

with open(states_file, 'w', encoding='utf-8') as f:
    json.dump(states, f, indent=2)
