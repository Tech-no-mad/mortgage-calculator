const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src', 'pages', 'blog');
const destDir = path.join(process.cwd(), 'src', 'content', 'blog');

const files = [
  '30-year-vs-15-year-mortgage.astro',
  'how-much-house-can-i-afford.astro',
  'how-to-avoid-pmi.astro',
  'what-credit-score-to-buy-a-house.astro',
  'when-to-refinance-your-mortgage.astro'
];

for (const file of files) {
  const filePath = path.join(srcDir, file);
  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract title
  const titleMatch = content.match(/const title = "(.*?)";/);
  const title = titleMatch ? titleMatch[1] : '';

  // Extract description
  const descMatch = content.match(/const description = "(.*?)";/);
  const desc = descMatch ? descMatch[1] : '';

  // Extract date
  const dateMatch = content.match(/"datePublished": "(.*?)"/);
  const date = dateMatch ? dateMatch[1] : '2026-07-01';

  // Extract canonicalUrl
  const urlMatch = content.match(/canonicalUrl="(.*?)"/);
  const canonicalUrl = urlMatch ? urlMatch[1] : `/blog/${file.replace('.astro', '')}/`;

  // Extract content inside <div class="prose...
  const proseStartIndex = content.indexOf('<div class="prose');
  let proseContent = '';
  if (proseStartIndex !== -1) {
    const endTag = '</BaseLayout>';
    const proseEndIndex = content.lastIndexOf('</article>');
    proseContent = content.substring(proseStartIndex, proseEndIndex).trim();
    
    // Remove the opening div tag of prose
    proseContent = proseContent.replace(/<div class="prose.*?">/, '');
    // Remove the closing div tag (last one before </article>)
    proseContent = proseContent.substring(0, proseContent.lastIndexOf('</div>')).trim();
  }

  // Remove the AdSlot if it exists
  proseContent = proseContent.replace(/<AdSlot.*?\/>/g, '');

  const mdContent = `---
title: "${title}"
description: "${desc}"
date: "${date}"
canonicalUrl: "${canonicalUrl}"
---

${proseContent}
`;

  fs.writeFileSync(path.join(destDir, file.replace('.astro', '.md')), mdContent);
  console.log(`Migrated ${file}`);
}
