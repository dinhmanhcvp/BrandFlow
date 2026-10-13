const fs = require('fs');
const path = require('path');

const pagePath = path.resolve(__dirname, '../frontend/src/app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

content = content.replace("      {/* Dải chúc mừng trang trọng Lễ kỷ niệm 70 năm */}\r\n      <AnniversaryBanner />\r\n\r\n", "");
content = content.replace("      {/* Dải chúc mừng trang trọng Lễ kỷ niệm 70 năm */}\n      <AnniversaryBanner />\n\n", "");
fs.writeFileSync(pagePath, content, 'utf8');
console.log('page.tsx successfully cleaned!');
