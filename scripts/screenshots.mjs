import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sitesDir = path.join(root, 'public', 'portfolio-sites');
const outDir = path.join(root, 'public', 'thumbnails');

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(sitesDir)
  .filter(f => f.endsWith('.html'))
  .sort();

console.log(`Taking screenshots of ${files.length} sites...`);

const browser = await chromium.launch({ headless: true });

for (const file of files) {
  const name = file.replace('.html', '');
  const filePath = path.join(sitesDir, file);
  const outPath = path.join(outDir, `${name}.jpg`);

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle', timeout: 15000 });

  // Clip to top 800px of the page
  await page.screenshot({
    path: outPath,
    type: 'jpeg',
    quality: 80,
    clip: { x: 0, y: 0, width: 1440, height: 800 },
  });
  await page.close();

  console.log(`  ✓ ${name}.jpg`);
}

await browser.close();
console.log(`Done! ${files.length} screenshots saved to public/thumbnails/`);
