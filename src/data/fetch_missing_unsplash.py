import json
import os
import time
import requests
from duckduckgo_search import DDGS

states_file = r'c:\Mortgage Calculator\src\data\states.json'
images_dir = r'c:\Mortgage Calculator\public\images\states'

with open(states_file, 'r', encoding='utf-8') as f:
    statesData = json.load(f)

ddgs = DDGS()

for s in statesData:
    if 'http' in s['heroImage']:
        query = f"site:unsplash.com {s['name']} landscape"
        print(f"Searching: {query}")
        try:
            results = ddgs.images(query, max_results=3)
            img_url = None
            if results:
                for res in results:
                    if 'unsplash.com' in res.get('image', ''):
                        img_url = res['image']
                        break
                if not img_url:
                    img_url = results[0]['image']
            
            if img_url:
                print(f"Found {img_url}, downloading...")
                r = requests.get(img_url, stream=True, headers={'User-Agent': 'Mozilla/5.0'})
                if r.status_code == 200:
                    filepath = os.path.join(images_dir, f"{s['slug']}.jpg")
                    with open(filepath, 'wb') as out_file:
                        for chunk in r.iter_content(1024):
                            out_file.write(chunk)
                    
                    s['heroImage'] = f"/images/states/{s['slug']}.jpg"
                    print(f"Success for {s['name']}")
                else:
                    print(f"Failed to download {img_url} with {r.status_code}")
            else:
                print(f"No results for {s['name']}")
                
        except Exception as e:
            print(f"Error for {s['name']}: {e}")
            
        time.sleep(1)

with open(states_file, 'w', encoding='utf-8') as f:
    json.dump(statesData, f, indent=2)

print("All done.")
