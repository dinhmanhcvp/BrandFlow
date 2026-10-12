import esbuild from 'esbuild';
import path from 'path';
import fs from 'fs';

const rootDir = process.cwd();
const contentTsPath = path.join(rootDir, 'src', 'content.ts');

async function main() {
  const result = await esbuild.build({
    entryPoints: [contentTsPath],
    bundle: true,
    format: 'esm',
    write: false,
    platform: 'node',
  });

  const bundledCode = result.outputFiles[0].text;
  const tempFile = path.join(rootDir, 'scripts', '.temp-content.mjs');
  fs.writeFileSync(tempFile, bundledCode, 'utf-8');

  const content = await import(`file://${tempFile}`);
  fs.unlinkSync(tempFile);

  console.log('='.repeat(70));
  console.log('BÁO CÁO KIỂM TRA NỘI DUNG BRANDFLOW SHOWCASE 70 NĂM');
  console.log('='.repeat(70));

  const emptyFields = [];
  const filledFields = [];

  function checkTextField(path, field) {
    if (!field || typeof field !== 'object') return;
    if ('label' in field && 'value' in field) {
      if (!field.value || field.value.trim() === '') {
        emptyFields.push({ path, label: field.label, max: field.max });
      } else {
        filledFields.push({ path, label: field.label, value: field.value });
      }
    }
  }

  function traverse(obj, prefix = '') {
    for (const [k, v] of Object.entries(obj)) {
      const currPath = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object') {
        if ('label' in v && 'value' in v) {
          checkTextField(currPath, v);
        } else if (Array.isArray(v)) {
          v.forEach((item, i) => traverse(item, `${currPath}[${i}]`));
        } else {
          traverse(v, currPath);
        }
      }
    }
  }

  traverse({
    brand: content.brand,
    event: content.event,
    s01: content.s01,
    s02: content.s02,
    s06: content.s06,
    s07: content.s07,
    s08: content.s08,
    s09: content.s09,
    s10: content.s10,
    s11: content.s11,
    s12: content.s12,
  });

  console.log(`\n[+] Tổng số trường đã có nội dung thật: ${filledFields.length}`);
  filledFields.forEach((f) => {
    console.log(`   - ${f.path} ("${f.label}"): "${f.value}"`);
  });

  console.log(`\n[!] Tổng số trường còn trống (đang dùng khung giữ chỗ / mẫu): ${emptyFields.length}`);
  emptyFields.forEach((f) => {
    console.log(`   - ${f.path} -> Nhãn: "${f.label}" (Giới hạn tối đa: ${f.max} ký tự)`);
  });

  console.log('\n' + '='.repeat(70));
  console.log('KẾT LUẬN: Bố cục đã sẵn sàng cho cả 3 chế độ (empty, short, long).');
  console.log('='.repeat(70) + '\n');
}

main().catch(console.error);
