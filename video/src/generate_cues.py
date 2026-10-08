import json

cues = []

def add(b, n, v=0.5, lead=0):
  cue = f" {{ beat: {b}, name: '{n}', volume: {v}"
  if lead:
    cue += f", leadFrames: {lead}"
  cue += " },"
  cues.append(cue)

# Whoosh vừa (lead 4)
for t in [3.5, 7.5, 11.5, 15.5, 19.5, 23.5, 61.5, 67.5, 73.5, 79.5, 85.5]:
  add(t*2, "whoosh", 0.5, 4)

# Whoosh lớn
for t in [13.5, 35.5, 53.5, 93.5]:
  add(t*2, "whoosh", 0.8)

# Digital scan
for t in [0.5, 4.0, 8.0, 12.0]:
  v = 0.3 if t == 12.0 else 0.5
  add(t*2, "tick", v)

# Stamp / thud (thẻ rơi)
v = 0.8
for t in [1.0, 1.4, 1.8, 2.2]:
  add(t*2, "boom", round(v, 2))
  v -= 0.2

# Pop (thẻ hiện)
for t in [4.5, 4.9, 5.3, 5.7, 8.5, 8.9, 9.3, 9.7]:
  add(t*2, "pop", 0.6)

# Boom + ting (14.0)
add(28.0, "boom", 1.0)
add(28.0, "ding", 0.8)

# Click chuột
add(16.5*2, "click", 0.8)
add(62.0*2, "click", 0.8)
# 69.0 (3 click)
add(138.0, "click", 0.8)
add(138.2, "click", 0.8)
add(138.4, "click", 0.8)
# 98.0 CTA
add(196.0, "click", 1.0)
add(196.0, "ding", 1.0)

# Notification pop
add(17.0*2, "pop", 0.6)
add(63.5*2, "pop", 0.6)
# 74.5 liên tiếp
add(149.0, "pop", 0.6)
add(149.2, "pop", 0.6)
add(149.4, "pop", 0.6)

# Hum (20 - 23)
for b in range(40*4, 46*4):
  add(b/4.0, "tick", 0.2)

# Digital ticking (24 - 25.5)
for b in range(48*4, 51*4):
  add(b/4.0, "tick", 0.3)

# UI swoosh nhẹ
for t in [25.0, 27.0, 29.0, 54.5, 57.5]:
  add(t*2, "whoosh", 0.4)

# Gõ phím
for start, end in [(36.5, 39.5), (40.5, 43.5), (44.5, 47.5), (48.5, 50.5), (70.0, 73.0), (76.5, 79.0)]:
  b_start = int(start * 2 * 4)
  b_end = int(end * 2 * 4)
  for b in range(b_start, b_end):
    add(b/4.0, "tick", 0.2)

# Ping (gửi xong)
for t in [39.5, 43.5, 47.5]:
  add(t*2, "ding", 0.6)

# Stamp xác nhận
add(50.5*2, "boom", 0.9)
add(50.5*2, "ding", 0.6)

# Pop kèm brush
add(56.0*2, "pop", 0.6)
add(56.0*2, "whoosh", 0.5)

# Chime thành công
add(59.0*2, "ding", 0.8)
add(96.5*2, "ding", 1.0)

# Swipe đổi tab
for t in [64.5, 65.5, 66.5]:
  add(t*2, "whoosh", 0.4)

# Paper flutter
for start, end in [(74.5, 76.0), (80.5, 85.0), (86.5, 93.0)]:
  b_start = int(start * 2)
  b_end = int(end * 2)
  for b in range(b_start, b_end, 2):
    add(b, "whoosh", 0.3)

# Logo power-up nhẹ
add(95.0*2, "boom", 0.5)

with open("cues.ts", "w") as f:
  f.write("import { beat } from './motion/beat';\n\nexport type SfxCue = { beat: number; name: string; volume: number; leadFrames?: number };\n\nexport const SFX_CUES: SfxCue[] = [\n")
  f.write("\n".join(cues))
  f.write("\n];\n")
