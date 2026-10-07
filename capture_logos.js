const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const refDir = path.join(__dirname, 'video', 'ref', 'logos');
  if (!fs.existsSync(refDir)) {
    fs.mkdirSync(refDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    deviceScaleFactor: 4,
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Splash/Loading screen usually disappears, but maybe it's still accessible or we can just try to capture navbar and footer.
  // The user says "màn chờ/splash (nếu có)". Next.js landing might not have a splash screen unless there's a loading state. Let's look for navbar first.

  try {
    const navbarLogo = page.locator('nav a.group, nav [href="/"]').first();
    await navbarLogo.waitFor({ state: 'visible', timeout: 5000 });
    await navbarLogo.screenshot({ path: path.join(refDir, 'navbar.png'), omitBackground: true });
    console.log('Navbar logo captured.');
  } catch (e) {
    console.error('Navbar logo failed:', e.message);
  }

  try {
    const footerLogo = page.locator('footer a.group, footer [href="/"]').first();
    await footerLogo.waitFor({ state: 'visible', timeout: 5000 });
    await footerLogo.screenshot({ path: path.join(refDir, 'footer.png'), omitBackground: true });
    console.log('Footer logo captured.');
  } catch (e) {
    console.error('Footer logo failed:', e.message);
  }

  // Check if splash logo exists
  // In `frontend/src/app/page.tsx` is there a splash screen?
  // Let's just capture the hero section logo if any or the BrandFlowLogo itself.
  try {
    const heroLogo = page.locator('.hero-logo, #splash-logo, .splash-logo').first();
    if (await heroLogo.count() > 0) {
        await heroLogo.screenshot({ path: path.join(refDir, 'splash.png'), omitBackground: true });
        console.log('Splash logo captured.');
    }
  } catch (e) {
    console.error('Splash logo failed:', e.message);
  }

  await browser.close();
})();
