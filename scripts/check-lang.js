const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../frontend/src/content/lekyniem.ts');

if (!fs.existsSync(targetFile)) {
  console.error('Không tìm thấy tệp:', targetFile);
  process.exit(1);
}

const content = fs.readFileSync(targetFile, 'utf8');

// Danh sách từ cấm theo đề bài
const forbiddenWords = [
  { word: /\bmarketing\b/i, reason: 'Phải dùng "tiếp thị" thay cho "marketing"' },
  { word: /\bagency\b/i, reason: 'Phải dùng "công ty dịch vụ" thay cho "agency"' },
  { word: /\bagent\b/i, reason: 'Phải dùng "trợ lý" thay cho "agent"' },
  { word: /\bđột phá\b/i, reason: 'Từ khoa trương bị cấm' },
  { word: /\bcách mạng\b/i, reason: 'Từ khoa trương bị cấm' },
  { word: /\bhàng đầu\b/i, reason: 'Từ khoa trương bị cấm' },
  { word: /\bsố 1\b/i, reason: 'Từ khoa trương bị cấm' },
  { word: /\btối ưu nhất\b/i, reason: 'Từ khoa trương bị cấm' }
];

console.log('='.repeat(60));
console.log('BÁO CÁO KIỂM TRA QUY TẮC TỪ NGỮ (CHECK:LANG)');
console.log('Tệp kiểm tra:', targetFile);
console.log('='.repeat(60));

const lines = content.split('\n');
let violations = 0;

lines.forEach((line, index) => {
  // Bỏ qua dòng ghi chú hướng dẫn ở đầu tệp
  if (index < 18) return;

  forbiddenWords.forEach(({ word, reason }) => {
    if (word.test(line)) {
      violations++;
      console.warn(`[CẢNH BÁO Dòng ${index + 1}] Phát hiện: "${line.trim()}" -> Lý do: ${reason}`);
    }
  });
});

console.log('-'.repeat(60));
if (violations === 0) {
  console.log('✓ CHÚC MỪNG: Không phát hiện từ vi phạm quy tắc ngôn ngữ tiếng Việt!');
} else {
  console.log(`Phát hiện ${violations} từ cần điều chỉnh.`);
}
console.log('='.repeat(60));
