import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src', 'pages');

const additionalKeywords = "mortgage calculator, home loan calculator, current mortgage rates, monthly mortgage payment, free mortgage calculator, mortgage payment calculator, house payment calculator, home mortgage calculator, calculate mortgage, mortgage estimator, monthly house payment, mortgage interest calculator, loan payment calculator, how much is my mortgage, mortgage calculator with taxes, mortgage calculator with PMI, mortgage calculator with insurance, PITI calculator, home buying calculator, home affordability calculator, mortgage amortization, what will my mortgage payment be, mortgage calculator 2025, best mortgage calculator, accurate mortgage calculator, simple mortgage calculator, mortgage calculator USA, home loan payment estimator, mortgage rate calculator, mortgage cost calculator";

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.astro')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for keywords="something"
      const keywordRegex = /keywords="([^"]+)"/;
      const match = content.match(keywordRegex);
      
      if (match) {
        const existingKeywords = match[1];
        
        // Split by comma, trim, combine, remove duplicates
        const allKeywords = [...new Set([
          ...existingKeywords.split(',').map(k => k.trim()),
          ...additionalKeywords.split(',').map(k => k.trim())
        ])].filter(k => k.length > 0).join(', ');
        
        content = content.replace(keywordRegex, `keywords="${allKeywords}"`);
        fs.writeFileSync(fullPath, content);
        console.log(`Expanded keywords in: ${file}`);
      }
    }
  }
}

processDirectory(pagesDir);
console.log('Keyword expansion complete.');
