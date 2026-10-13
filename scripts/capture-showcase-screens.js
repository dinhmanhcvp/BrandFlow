const { chromium } = require('../frontend/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/02ed605e-d7fb-4766-b198-aa555467f4a9';
const SCREENSHOT_DIR = path.resolve(__dirname, '../frontend/public/assets/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capture() {
  console.log('Khởi động trình duyệt chụp ảnh màn hình...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  }

  // 1. Chụp màn hình ngang 16:9 (1920 x 1080) - Chế độ Triển lãm Lễ kỷ niệm
  console.log('Chụp 16:9 Showcase mode (1920x1080)...');
  const context16_9 = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page16_9 = await context16_9.newPage();
  await page16_9.goto('http://localhost:3000/?trungbay=1', { waitUntil: 'networkidle' });
  await page16_9.waitForTimeout(1000);

  const shot16_9_full = path.join(SCREENSHOT_DIR, 'showcase_16_9_full.png');
  const shot16_9_hero = path.join(SCREENSHOT_DIR, 'showcase_16_9_hero.png');
  const shot16_9_timeline = path.join(SCREENSHOT_DIR, 'showcase_16_9_timeline.png');
  const shot16_9_outcomes = path.join(SCREENSHOT_DIR, 'showcase_16_9_outcomes.png');
  const shot16_9_rulers = path.join(SCREENSHOT_DIR, 'showcase_16_9_rulers.png');

  await page16_9.screenshot({ path: shot16_9_full, fullPage: true });
  console.log('✓ Đã lưu:', shot16_9_full);

  // Chụp từng khoang ở 16:9
  const heroEl = await page16_9.$('#sec-hero');
  if (heroEl) await heroEl.screenshot({ path: shot16_9_hero });

  const timelineEl = await page16_9.$('#sec-timeline');
  if (timelineEl) await timelineEl.screenshot({ path: shot16_9_timeline });

  const outcomesEl = await page16_9.$('#sec-outcomes');
  if (outcomesEl) await outcomesEl.screenshot({ path: shot16_9_outcomes });

  const rulersEl = await page16_9.$('#sec-rulers');
  if (rulersEl) await rulersEl.screenshot({ path: shot16_9_rulers });

  // 2. Chụp màn hình dọc 9:16 (1080 x 1920) - Chế độ Triển lãm Lễ kỷ niệm TV đứng
  console.log('Chụp 9:16 Showcase mode (1080x1920)...');
  const context9_16 = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1
  });
  const page9_16 = await context9_16.newPage();
  await page9_16.goto('http://localhost:3000/?trungbay=1', { waitUntil: 'networkidle' });
  await page9_16.waitForTimeout(1000);

  const shot9_16_full = path.join(SCREENSHOT_DIR, 'showcase_9_16_full.png');
  const shot9_16_hero = path.join(SCREENSHOT_DIR, 'showcase_9_16_hero.png');
  await page9_16.screenshot({ path: shot9_16_full, fullPage: true });
  console.log('✓ Đã lưu:', shot9_16_full);

  const hero916El = await page9_16.$('#sec-hero');
  if (hero916El) await hero916El.screenshot({ path: shot9_16_hero });

  // 3. Chụp Chế độ thường (Normal mode - http://localhost:3000)
  console.log('Chụp Normal mode có AnniversaryBanner (1920x1080)...');
  const pageNormal = await context16_9.newPage();
  await pageNormal.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pageNormal.waitForTimeout(4500); // Đợi splash screen biến mất

  const shotNormal = path.join(SCREENSHOT_DIR, 'normal_mode_banner.png');
  await pageNormal.screenshot({ path: shotNormal, fullPage: false });
  console.log('✓ Đã lưu:', shotNormal);

  // Copy các ảnh vào thư mục artifact để xem trực tiếp
  const artifactDest1 = path.join(ARTIFACT_DIR, 'showcase_16_9_full.png');
  const artifactDest2 = path.join(ARTIFACT_DIR, 'showcase_9_16_full.png');
  const artifactDest3 = path.join(ARTIFACT_DIR, 'normal_mode_banner.png');

  fs.copyFileSync(shot16_9_full, artifactDest1);
  fs.copyFileSync(shot9_16_full, artifactDest2);
  fs.copyFileSync(shotNormal, artifactDest3);

  console.log('✓ Hoàn tất sao chép vào Artifacts!');
  await browser.close();
}

capture().catch(console.error);
