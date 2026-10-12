"""Tạo bản biểu trưng 70 năm nền trong suốt, cắt bớt lề trắng (giữ nguyên màu & tỉ lệ hình)."""
import re, pathlib
p = pathlib.Path(__file__).resolve().parent.parent / 'public' / 'assets' / 'official'
src = p / 'logo-ky-niem-70-nam-goc.svg'
dst = p / 'logo-ky-niem-70-nam.svg'
if not src.exists():
    src.write_text(dst.read_text(encoding='utf-8'), encoding='utf-8')
s = src.read_text(encoding='utf-8')
s, n = re.subn(r'<rect class="cls-1" x="0" y="0" width="1500" height="1500"\s*/>', '', s, count=1)
s = s.replace('viewBox="0 0 1500 1500"', 'viewBox="262 290 976 830"', 1)
dst.write_text(s, encoding='utf-8')
print('removed bg rect:', n)
