const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const videoFile = 'file:///' + path.join(__dirname, '..', 'video', 'public', 'ref', 'Homepage.mp4').replace(/\\/g, '/');
  
  await page.goto('about:blank');
  await page.setContent(`
    <video id="v" src="${videoFile}"></video>
  `);
  
  const dimensions = await page.evaluate(() => {
    return new Promise(resolve => {
      const v = document.getElementById('v');
      v.onloadedmetadata = () => {
        resolve({ w: v.videoWidth, h: v.videoHeight });
      };
    });
  });
  
  console.log('Homepage.mp4 dimensions:', dimensions);
  await browser.close();
})();
