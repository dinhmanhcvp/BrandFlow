import os
import glob
import shutil

files = glob.glob("Agent Voiceover*.mp3")

mapping = [
    ("Ngân", "vo-1.mp3"),
    ("Thuê", "vo-2.mp3"),
    ("Hỏi", "vo-3.mp3"),
    ("Vậy", "vo-4.mp3"),
    ("BrandFlow.mp3", "vo-5.mp3"), # exact match to avoid conflict with 14
    ("Thả", "vo-6.mp3"),
    ("Brand DNA", "vo-7.mp3"),
    ("Rồi", "vo-8.mp3"),
    ("Chiến", "vo-9.mp3"),
    ("Bộ", "vo-10.mp3"),
    ("Một", "vo-11.mp3"),
    ("Tùy", "vo-12.mp3"),
    ("Kế", "vo-13.mp3"),
    ("Từ", "vo-14.mp3")
]

for f in files:
    for prefix, target in mapping:
        if prefix in f:
            try:
                shutil.move(f, target)
            except:
                pass
            break
