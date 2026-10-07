import os
from gtts import gTTS

cues = [
  {"id": 1, "text": "Ngân sách marketing, bị đốt phí vì đâu?"},
  {"id": 2, "text": "Thuê a-gien-xi thì chậm, mà lại đắt."},
  {"id": 3, "text": "Hỏi y-ai thì thiếu thực tế."},
  {"id": 4, "text": "Vậy đâu là cách tốt hơn?"},
  {"id": 5, "text": "Bran Pờ-lâu."},
  {"id": 6, "text": "Thả một file. Y-ai đọc cả thương hiệu."},
  {"id": 7, "text": "Bran Đi-en-nay hiện ra, để bạn thấy tiền đang phí ở đâu."},
  {"id": 8, "text": "Rồi các ê-dừn bắt đầu tranh luận."},
  {"id": 9, "text": "Chiến lược chỉ chốt sau khi phản biện."},
  {"id": 10, "text": "Bộ nhận diện thương hiệu, tạo tự động."},
  {"id": 11, "text": "Một prôm, nội dung cho mọi kênh."},
  {"id": 12, "text": "Tùy biến ê-dừn riêng cho doanh nghiệp."},
  {"id": 13, "text": "Kế hoạch và báo cáo chiến lược, xuất ngay."},
  {"id": 14, "text": "Bran Pờ-lâu. Từ ríp đến chiến lược. Không cần a-gien-xi."}
]

for cue in cues:
    tts = gTTS(text=cue["text"], lang="vi", slow=False)
    filename = f"vo-{cue['id']}.mp3"
    tts.save(filename)
    print(f"Generated {filename}")
