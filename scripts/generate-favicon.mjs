import { chromium } from 'playwright';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const svgPath = path.join(root, 'src', 'app', 'icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Generate PNGs at multiple sizes using sharp
const sizes = [16, 32, 48];
const pngBuffers = [];

for (const size of sizes) {
  const buf = await sharp(Buffer.from(svgContent))
    .resize(size, size)
    .png()
    .toBuffer();
  pngBuffers.push({ size, buf });
}

// Build ICO file manually
// ICO format: header + directory entries + image data
function buildIco(images) {
  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = images.length;

  let dataOffset = headerSize + dirEntrySize * numImages;
  const dirEntries = [];
  const imageData = [];

  for (const { size, buf } of images) {
    dirEntries.push({
      width: size < 256 ? size : 0,
      height: size < 256 ? size : 0,
      dataSize: buf.length,
      offset: dataOffset,
    });
    imageData.push(buf);
    dataOffset += buf.length;
  }

  const totalSize = dataOffset;
  const ico = Buffer.alloc(totalSize);

  // Header
  ico.writeUInt16LE(0, 0);      // reserved
  ico.writeUInt16LE(1, 2);      // type: 1 = ICO
  ico.writeUInt16LE(numImages, 4);

  // Directory entries
  let pos = headerSize;
  for (const entry of dirEntries) {
    ico.writeUInt8(entry.width, pos);
    ico.writeUInt8(entry.height, pos + 1);
    ico.writeUInt8(0, pos + 2);   // color palette
    ico.writeUInt8(0, pos + 3);   // reserved
    ico.writeUInt16LE(1, pos + 4);  // color planes
    ico.writeUInt16LE(32, pos + 6); // bits per pixel
    ico.writeUInt32LE(entry.dataSize, pos + 8);
    ico.writeUInt32LE(entry.offset, pos + 12);
    pos += dirEntrySize;
  }

  // Image data
  for (const buf of imageData) {
    buf.copy(ico, pos);
    pos += buf.length;
  }

  return ico;
}

const ico = buildIco(pngBuffers);
const outPath = path.join(root, 'src', 'app', 'favicon.ico');
fs.writeFileSync(outPath, ico);
console.log(`Favicon saved to src/app/favicon.ico (${sizes.join(', ')}px)`);
