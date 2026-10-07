export type VoCue = { id: number; beat: number; text: string; file: string; playbackRate?: number };

export const VO_CUES: VoCue[] = [
  { id: 1, beat: 1.2, text: "Ngân sách marketing, bị đốt phí vì đâu?", file: "vo-1.mp3" },
  { id: 2, beat: 8.2, text: "Thuê agency thì chậm, mà lại đắt.", file: "vo-2.mp3" },
  { id: 3, beat: 16.2, text: "Hỏi AI thì thiếu thực tế.", file: "vo-3.mp3" },
  { id: 4, beat: 24.0, text: "Vậy đâu là cách tốt hơn?", file: "vo-4.mp3", playbackRate: 1.15 },
  { id: 5, beat: 28.0, text: "BrandFlow.", file: "vo-5.mp3" },
  { id: 6, beat: 33.6, text: "Thả một file. AI đọc cả thương hiệu.", file: "vo-6.mp3", playbackRate: 1.15 },
  { id: 7, beat: 48.8, text: "Brand DNA hiện ra, để bạn thấy tiền đang phí ở đâu.", file: "vo-7.mp3" },
  { id: 8, beat: 72.2, text: "Rồi các agent bắt đầu tranh luận.", file: "vo-8.mp3" },
  { id: 9, beat: 102.0, text: "Chiến lược chỉ chốt sau khi phản biện.", file: "vo-9.mp3" },
  { id: 10, beat: 109.2, text: "Bộ nhận diện thương hiệu, tạo tự động.", file: "vo-10.mp3" },
  { id: 11, beat: 123.6, text: "Một prompt, nội dung cho mọi kênh.", file: "vo-11.mp3" },
  { id: 12, beat: 136.0, text: "Tùy biến agent riêng cho doanh nghiệp.", file: "vo-12.mp3" },
  { id: 13, beat: 161.2, text: "Kế hoạch và báo cáo chiến lược, xuất ngay.", file: "vo-13.mp3" },
  { id: 14, beat: 190.4, text: "BrandFlow. Từ brief đến chiến lược. Không cần agency.", file: "vo-14.mp3" },
];
