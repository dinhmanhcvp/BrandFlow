const fs = require('fs');
const path = require('path');

const navbarPath = path.resolve(__dirname, '../frontend/src/components/landing/Navbar.tsx');
let content = fs.readFileSync(navbarPath, 'utf8');

if (!content.includes('AnniversaryBanner')) {
  content = content.replace(
    "import { useLanguage } from '@/contexts/LanguageContext';",
    "import { useLanguage } from '@/contexts/LanguageContext';\r\nimport AnniversaryBanner from './AnniversaryBanner';"
  );
  content = content.replace(
    '<nav className={`fixed top-0 w-full z-50',
    '<div className="fixed top-0 w-full z-50"><AnniversaryBanner /><nav className={`w-full'
  );
  content = content.replace('</nav>', '</nav></div>');
  fs.writeFileSync(navbarPath, content, 'utf8');
  console.log('Navbar successfully updated with AnniversaryBanner wrapper!');
} else {
  console.log('Navbar already updated.');
}
