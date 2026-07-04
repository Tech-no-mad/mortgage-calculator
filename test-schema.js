const fs = require('fs');
const path = require('path');
const statesDir = './dist/client/states';
const states = fs.readdirSync(statesDir);
let allValid = true;
let totalChecked = 0;
for (const s of states) {
  const htmlPath = path.join(statesDir, s, 'index.html');
  if (!fs.existsSync(htmlPath)) continue;
  const html = fs.readFileSync(htmlPath, 'utf8');
  const scriptContent = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (scriptContent) {
    try {
      JSON.parse(scriptContent[1]);
      totalChecked++;
    } catch (e) {
      console.error('Invalid JSON in state:', s, e.message);
      allValid = false;
    }
  }
}
if (allValid) console.log(`All ${totalChecked} schemas are valid JSON!`);
