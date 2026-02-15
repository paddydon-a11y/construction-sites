import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const thumbDir = path.join(root, 'public', 'thumbnails');

// Read thumbnails as base64 data URIs
function thumb(name) {
  const buf = fs.readFileSync(path.join(thumbDir, name));
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

const t1 = thumb('site-01.jpg');
const t2 = thumb('site-40.jpg');
const t3 = thumb('site-05.jpg');
const t4 = thumb('site-37.jpg');
const t5 = thumb('site-07.jpg');
const t6 = thumb('site-03.jpg');

const html = `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1200px;
    height: 630px;
    background: #0f1729;
    font-family: 'Barlow', sans-serif;
    overflow: hidden;
    position: relative;
  }

  .grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .tape {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 8px;
    background: repeating-linear-gradient(-45deg, #f59e0b, #f59e0b 20px, #111827 20px, #111827 40px);
  }

  .content {
    position: relative;
    z-index: 2;
    display: flex;
    height: 100%;
    padding: 50px 60px 40px;
  }

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 40px;
  }

  .logo-line {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
  }

  .logo-icon { font-size: 40px; }

  .logo-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    font-size: 32px;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  h1 {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    font-size: 76px;
    line-height: 1.05;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  h1 .highlight { color: #f59e0b; }

  .right {
    width: 440px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 10px;
    align-content: center;
  }

  .thumb {
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid rgba(255,255,255,0.1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }

  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    display: block;
  }

  .tape-bottom {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 8px;
    background: repeating-linear-gradient(-45deg, #f59e0b, #f59e0b 20px, #111827 20px, #111827 40px);
  }

  .url {
    position: absolute;
    bottom: 22px;
    right: 60px;
    font-size: 16px;
    color: #64748b;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
</style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="tape"></div>

  <div class="content">
    <div class="left">
      <div class="logo-line">
        <span class="logo-icon">🏗️</span>
        <span class="logo-text">Construction Sites</span>
      </div>
      <h1>Get <span class="highlight">Better Work</span><br>with a <span class="highlight">Better</span><br>Website.</h1>
    </div>
    <div class="right">
      <div class="thumb"><img src="${t1}" /></div>
      <div class="thumb"><img src="${t2}" /></div>
      <div class="thumb"><img src="${t3}" /></div>
      <div class="thumb"><img src="${t4}" /></div>
      <div class="thumb"><img src="${t5}" /></div>
      <div class="thumb"><img src="${t6}" /></div>
    </div>
  </div>

  <div class="tape-bottom"></div>
  <span class="url">construction-sites.co.uk</span>
</body>
</html>`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: 'networkidle', timeout: 15000 });

await page.screenshot({
  path: path.join(root, 'public', 'og-image.png'),
  type: 'png',
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});

await browser.close();
console.log('OG image saved to public/og-image.png');
