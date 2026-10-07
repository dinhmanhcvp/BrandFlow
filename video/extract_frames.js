const { execSync } = require('child_process');
const fs = require('fs');

const beats = [0.5, 14, 17, 26, 34, 44, 52, 57, 64, 84, 100, 114];
const fps = 30;
const framesPerBeat = 15; // 1 beat = 0.5s = 15 frames

if (!fs.existsSync('out/frames')) {
  fs.mkdirSync('out/frames', { recursive: true });
}

console.log('Extracting frames for review...');

beats.forEach(b => {
  const frame = Math.round(b * framesPerBeat);
  const outPath = `out/frames/beat_${b}_frame_${frame}.png`;
  console.log(`Extracting beat ${b} (frame ${frame})...`);
  try {
    execSync(`npx remotion still src/index.ts Main ${outPath} --frame=${frame}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to extract frame ${frame}`);
  }
});

console.log('Extraction complete! Check out/frames/');
