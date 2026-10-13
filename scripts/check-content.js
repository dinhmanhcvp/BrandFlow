const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../frontend/src/content/lekyniem.ts');

if (!fs.existsSync(targetFile)) {
  console.error('Không tìm thấy tệp:', targetFile);
  process.exit(1);
}

const content = fs.readFileSync(targetFile, 'utf8');
const lines = content.split('\n');

console.log('='.repeat(60));
console.log('BÁO CÁO RÀ SOÁT CÁC TRƯỜNG CHƯA ĐIỀN: [CẦN ĐIỀN]');
console.log('Tệp kiểm tra:', targetFile);
console.log('='.repeat(60));

let count = 0;
lines.forEach((line, index) => {
  if (line.includes('[CẦN ĐIỀN]')) {
    count++;
    console.log(`Dòng ${index + 1}: ${line.trim()}`);
  }
});

console.log('-'.repeat(60));
console.log(`Tổng số vị trí cần điền thông tin chính thức: ${count}`);
console.log('='.repeat(60));
