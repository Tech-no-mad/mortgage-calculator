import fs from 'fs';
import https from 'https';

const file = 'src/data/states.json';
let states = JSON.parse(fs.readFileSync(file, 'utf8'));

async function fetchWikiImage(stateName) {
  const title = encodeURIComponent(stateName);
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${title}&pithumbsize=1600&format=json`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'MortgageDash/1.0' } }, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const page = pages[Object.keys(pages)[0]];
          resolve(page.thumbnail ? page.thumbnail.source : null);
        } catch(e) { resolve(null); }
      });
    });
  });
}

async function run() {
  for (let s of states) {
    if (!s.heroImage) {
      console.log('Fetching for', s.name);
      let img = await fetchWikiImage(s.name);
      if (!img) {
        img = await fetchWikiImage(s.name + ' (state)');
      }
      if (!img && s.name === 'Washington') img = await fetchWikiImage('Washington (state)');
      if (!img && s.name === 'Georgia') img = await fetchWikiImage('Georgia (U.S. state)');
      if (!img && s.name === 'New York') img = await fetchWikiImage('New York (state)');
      
      s.heroImage = img || 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1600&q=80';
    }
  }
  fs.writeFileSync(file, JSON.stringify(states, null, 2));
  console.log('Done!');
}
run();