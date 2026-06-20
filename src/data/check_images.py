import json
import requests
import concurrent.futures

d = json.load(open(r'c:\Mortgage Calculator\src\data\states.json'))
urls = {s['name']: s.get('heroImage') for s in d}

def check(item):
    name, url = item
    if not url: return f"Missing url for {name}"
    try:
        r = requests.head(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=5)
        if r.status_code >= 400:
            return f"{name} failed with {r.status_code}: {url}"
    except Exception as e:
        return f"{name} exception {e}: {url}"
    return None

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
    results = list(ex.map(check, urls.items()))

errors = [r for r in results if r]
print(f"Total Errors: {len(errors)}")
for e in errors:
    print(e)
