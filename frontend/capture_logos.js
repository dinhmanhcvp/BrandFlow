const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const refDir = path.join(__dirname, '..', 'video', 'public', 'ref', 'logos');
  if (!fs.existsSync(refDir)) {
    fs.mkdirSync(refDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    deviceScaleFactor: 4,
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Capture Navbar logo
  try {
    const navbarLogo = page.locator('nav a.group, nav [href="/"]').first();
    await navbarLogo.waitFor({ state: 'visible', timeout: 5000 });
    await navbarLogo.screenshot({ path: path.join(refDir, 'navbar.png'), omitBackground: true });
    console.log('Navbar logo captured.');
  } catch (e) {
    console.error('Navbar logo failed:', e.message);
  }

  // 2. Capture Footer logo
  try {
    const footerLogo = page.locator('footer a.group, footer [href="/"]').first();
    await footerLogo.waitFor({ state: 'visible', timeout: 5000 });
    await footerLogo.screenshot({ path: path.join(refDir, 'footer.png'), omitBackground: true });
    console.log('Footer logo captured.');
  } catch (e) {
    console.error('Footer logo failed:', e.message);
  }

  await browser.close();
  console.log('Done.');
})();
