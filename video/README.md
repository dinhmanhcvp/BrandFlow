# BrandFlow Pitch Video Project

## Yêu cầu hệ thống
- Node.js >= 18
- FFmpeg (dùng cho công đoạn Loudnorm)

## Cài đặt
```bash
cd video
npm install
```

## Các lệnh Render

**1. Bản Draft (Kiểm tra nhanh)**
```bash
npx remotion render Main out/draft.mp4 --scale=0.5 --crf=28 --concurrency=50%
```

**2. Bản chính thức (1080p)**
```bash
npx remotion render Main out/brandflow-pitch-1080.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --audio-codec=aac --audio-bitrate=320k --gl=angle --concurrency=50%
```

**3. Bản 4K (Cho màn hình lớn)**
```bash
npx remotion render Main out/brandflow-pitch-4k.mp4 --scale=2 --codec=h264 --crf=16
```

**4. Xuất Poster (Frame khoảnh khắc chốt hạ Consensus)**
```bash
npx remotion still Main out/poster.png --frame=966
```

## Cách cấu hình
- Đổi màu sắc, typography: sửa `src/tokens.ts`
- Đổi nhịp điệu (BPM, mốc beat): sửa `src/timeline.ts` và `src/motion/beat.ts`
- Thêm âm thanh: bỏ file `.wav` vào `public/audio/` và gọi tên trong `src/sfxCues.ts`

## Âm thanh và Loudness
Sau khi render bản 1080p, cần chạy FFmpeg để chuẩn hoá âm thanh:
```bash
ffmpeg -i out/brandflow-pitch-1080.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=9 -c:v copy -c:a aac -b:a 320k out/brandflow-pitch-1080-final.mp4
```
