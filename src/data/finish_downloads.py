import json
import os
import time
import requests

states_file = r'c:\Mortgage Calculator\src\data\states.json'
images_dir = r'c:\Mortgage Calculator\public\images\states'

with open(states_file, 'r') as f:
    statesData = json.load(f)

for s in statesData:
    if 'http' in s['heroImage']:
        # Fetch fresh thumbnail url from wikipedia API
        title = s['name'].replace(' ', '_')
        if s['name'] in ['Georgia', 'Washington', 'New York']:
            title = f"{title}_(U.S._state)"
            
        api_url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles={title}&pithumbsize=1920&format=json"
        
        try:
            print(f"Querying API for {s['name']}...")
            res = requests.get(api_url, headers={"User-Agent": "MortgageBot/1.0"})
            data = res.json()
            pages = data['query']['pages']
            page_id = list(pages.keys())[0]
            
            if 'thumbnail' in pages[page_id]:
                img_url = pages[page_id]['thumbnail']['source']
                print(f"Found URL: {img_url}")
                
                # Download the image
                r = requests.get(img_url, headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Referer": "https://en.wikipedia.org/"
                }, stream=True)
                
                if r.status_code == 200:
                    filepath = os.path.join(images_dir, f"{s['slug']}.jpg")
                    with open(filepath, 'wb') as out_file:
                        for chunk in r.iter_content(1024):
                            out_file.write(chunk)
                    
                    s['heroImage'] = f"/images/states/{s['slug']}.jpg"
                    print(f"Successfully downloaded {s['name']}")
                else:
                    print(f"Download failed for {s['name']} with status {r.status_code}")
            else:
                print(f"No thumbnail found in API for {s['name']}")
                
        except Exception as e:
            print(f"Exception for {s['name']}: {e}")
            
        time.sleep(2) # Prevent 429

with open(states_file, 'w') as f:
    json.dump(statesData, f, indent=2)

print("Done")
