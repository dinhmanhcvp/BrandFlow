const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const imgPath = path.resolve('frontend/public/assets/official/image1.png');
  const fileUrl = 'file:///' + imgPath.replace(/\\/g, '/');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:white;">
        <canvas id="cv"></canvas>
      </body>
    </html>
  `);

  const cropResult = await page.evaluate(async (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const W = img.naturalWidth;
        const H = img.naturalHeight;
        
        // Let's create a canvas to inspect pixels or crop
        const cv = document.getElementById('cv');
        cv.width = W;
        cv.height = H;
        const ctx = cv.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Find top banner: Top banner in image1 is around y=0 to y=1000 or similar
        // Let's crop the HUST lockup (logo + text)
        // In top_banner.jpg, HUST logo was at the left side of the banner.
        // Let's crop region x: 200 to 2200, y: 150 to 900
        const logoCanvas = document.createElement('canvas');
        logoCanvas.width = 2400;
        logoCanvas.height = 900;
        const lctx = logoCanvas.getContext('2d');
        // Let's sample a few coordinate ranges
        resolve({ W, H });
      };
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  }, fileUrl);

  console.log('Result:', cropResult);
  await browser.close();
}

run().catch(console.error);
