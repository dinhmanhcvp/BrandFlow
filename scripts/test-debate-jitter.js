const { chromium } = require('../frontend/node_modules/playwright');

async function testDebate() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:3000/workspace...');
  await page.goto('http://localhost:3000/workspace', { waitUntil: 'networkidle' });

  // Record heights of components over 3 seconds during text typing
  for (let i = 0; i < 10; i++) {
    await page.waitForTimeout(300);
    const metrics = await page.evaluate(() => {
      const speechCard = document.querySelector('.bg-white.dark\\:bg-slate-900.border-2.border-cyan-500\\/40, [class*="border-cyan-500"]');
      const planSheet = document.querySelector('[class*="border-slate-300"]');
      return {
        speechH: speechCard ? speechCard.getBoundingClientRect().height : 0,
        planH: planSheet ? planSheet.getBoundingClientRect().height : 0,
        scrollY: window.scrollY
      };
    });
    console.log(`Tick ${i}:`, metrics);
  }

  await browser.close();
}

testDebate().catch(console.error);
