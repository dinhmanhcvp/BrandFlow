import path from 'path';
import fs from 'fs';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const rootDir = process.cwd();
const entryPoint = path.join(rootDir, 'src', 'index.ts');

async function main() {
  console.log('='.repeat(70));
  console.log('BẮT ĐẦU XUẤT 24 ẢNH STILL (12 EMPTY + 12 LONG)');
  console.log('='.repeat(70));

  const outEmptyDir = path.join(rootDir, 'out', 'stills', 'empty');
  const outLongDir = path.join(rootDir, 'out', 'stills', 'long');
  fs.mkdirSync(outEmptyDir, { recursive: true });
  fs.mkdirSync(outLongDir, { recursive: true });

  console.log('Đang bundle Remotion composition...');
  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });
  console.log('Bundle hoàn tất:', bundleLocation);

  const modes = ['empty', 'long'];

  for (const mode of modes) {
    console.log(`\n--- Đang xuất chế độ: ${mode.toUpperCase()} ---`);
    const targetDir = mode === 'empty' ? outEmptyDir : outLongDir;

    for (let i = 1; i <= 12; i++) {
      const compId = `Slide-${i.toString().padStart(2, '0')}`;
      const outFile = path.join(targetDir, `slide-${i.toString().padStart(2, '0')}.png`);

      console.log(`Đang xuất [${mode}] ${compId} -> ${path.basename(outFile)}...`);

      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: compId,
        inputProps: {
          index: i - 1,
          previewMode: mode,
        },
      });

      // Frame 60 (2 giây) đảm bảo các chuyển động vào đã hoàn thành đầy đủ
      await renderStill({
        composition,
        serveUrl: bundleLocation,
        output: outFile,
        frame: 60,
        imageFormat: 'png',
      });
      console.log(`✓ Đã lưu: ${outFile}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('HOÀN TẤT XUẤT 24 ẢNH PNG CHO CẢ 2 CHẾ ĐỘ EMPTY VÀ LONG!');
  console.log('='.repeat(70));
}

main().catch((err) => {
  console.error('Lỗi khi xuất ảnh still:', err);
  process.exit(1);
});
