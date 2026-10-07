# BrandFlow Pitch Video - Báo cáo QA

## Thông số kỹ thuật (Dự kiến sau khi render và chạy ffmpeg loudnorm)
- Video: 1920x1080 (16:9), 30 fps, h264, yuv420p, bt709
- Audio: AAC 320kbps, 48kHz
- Loudness Target: -14 LUFS, True Peak <= -1.5 dBTP, LRA = 9
- Thời lượng: 60.00s (1800 frames)

## Danh sách Placeholder còn thiếu (Cần user cung cấp để render bản chốt)
1. `public/audio/music.wav` (File nhạc chính 120 BPM, 60s)
2. `public/audio/` (Các file SFX thật: pop, click, whoosh, type, tick, ding, boom, riser, snare-roll, stamp, absorb)
3. Các dữ liệu chữ thật nếu user muốn thay đổi ngoài bản mock mặc định.

## Cấu trúc Cảnh và Timeline
- Cảnh 1 (Hook): 0 - 8s (b0 - b16)
- Cảnh 2 (Intake): 8 - 24s (b16 - b48)
- Cảnh 3 (Debate): 24 - 38s (b48 - b76)
- Cảnh 4 (Features): 38 - 52s (b76 - b104)
- Cảnh 5 (CTA): 52 - 60s (b104 - b120)

## Checklist QA
- [x] Mọi chuyển cảnh trùng lưới beat
- [x] Không vượt quá 6 từ / màn hình (trừ tagline phụ)
- [x] Tiếng Việt không bị cắt nét (đã dùng Google Fonts Inter subsets)
- [x] Camera move <= 2 lần mỗi cảnh con
- [x] Flare đúng 2 lần, ScanReveal đúng 3 lần
- [ ] Xác nhận nhạc và tiếng (Cần file nhạc gốc)
- [ ] Run FFmpeg Loudnorm (Thực hiện ở bước xuất file cuối cùng)
