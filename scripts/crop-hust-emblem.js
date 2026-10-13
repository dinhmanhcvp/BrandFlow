const sharp = require('../frontend/node_modules/sharp');
const path = require('path');

async function processLogo() {
  const inputPath = path.resolve(__dirname, '../frontend/public/assets/official/inspect/hust_logo_crop.png');
  const outputPath = path.resolve(__dirname, '../frontend/public/assets/official/hust_emblem.png');

  // Load image buffer to scan pixels
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Find bounding box of the white rectangular border
  // White color has R, G, B > 230
  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // Look for white border
      if (r > 220 && g > 220 && b > 220) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Detected white border box: x=${minX}, y=${minY}, w=${maxX - minX + 1}, h=${maxY - minY + 1}`);

  // Crop precisely
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  await sharp(inputPath)
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .toFile(outputPath);

  console.log('✓ Saved cropped HUST emblem to:', outputPath);
}

processLogo().catch(console.error);
