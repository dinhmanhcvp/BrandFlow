import { beat } from './motion/beat';

export type SfxCue = { beat: number; file: string; volume: number; leadFrames?: number };

// Premium SFX Roadmap - Mapped to user's uploaded MP3 files
export const SFX_CUES: SfxCue[] = [
 // 0-14s: Nêu vấn đề (Low drone tension)
 { beat: 0.0, file: 'dragon-studio-deep-sub-drop-450456.mp3', volume: 0.4, leadFrames: 0 },

 // ~7.0s: Nêu vấn đề (pop subtle 01)
 { beat: 14.0, file: 'Subtle pop 01.mp3', volume: 0.5, leadFrames: 3 },

 // 13.0: Riser ngay trước BrandFlow
 { beat: 26.0, file: 'soundreality-riser-hit-comet-445701.mp3', volume: 0.6, leadFrames: 3 },

 // ~13.5s: Chuyển cảnh sang BrandFlow (whoosh swipe 01)
 { beat: 27.0, file: 'Whoosh swipe 01.mp3', volume: 0.6, leadFrames: 3 },

 // 14.3: BrandFlow hiện ra (Sub bass hit + Logo reveal chime)
 { beat: 28.6, file: 'dragon-studio-deep-sub-drop-450456.mp3', volume: 0.8, leadFrames: 3 },
 { beat: 28.6, file: 'freesound_community-other-32367.mp3', volume: 0.7, leadFrames: 3 },

 // 16.8: Thả file (Soft click 01)
 { beat: 33.6, file: 'Soft click 01.mp3', volume: 0.6, leadFrames: 3 },

 // ~19.0: AI đọc thương hiệu / thẻ trượt (Glass shimmer, sparkle ascending)
 { beat: 38.0, file: 'chrysalyn-clean-double-pop-and-magic-sparkle-alert-sound-effect-543522.mp3', volume: 0.5, leadFrames: 3 },

 // 24.4: Brand DNA popup (Subtle pop 02)
 { beat: 48.8, file: 'Subtle pop 02.mp3', volume: 0.6, leadFrames: 3 },

 // 54.6: Tạo bộ nhận diện / Mở rộng (Whoosh transition 03 & Soft click 02)
 { beat: 109.2, file: 'Whoosh transition 03.mp3', volume: 0.5, leadFrames: 3 },
 { beat: 110.0, file: 'Soft click 02.mp3', volume: 0.5, leadFrames: 3 },
 { beat: 111.0, file: 'Soft click 02.mp3', volume: 0.5, leadFrames: 3 },

 // 61.8: Nội dung mọi kênh (Whoosh swipe 01)
 { beat: 123.6, file: 'Whoosh swipe 01.mp3', volume: 0.5, leadFrames: 3 },

 // 68.0: Tùy biến agent (Toggle switch 01)
 { beat: 136.0, file: 'Toggle switch 01.mp3', volume: 0.6, leadFrames: 3 },

 // 80.6: Kế hoạch xuất ra (Confirmation chime 01)
 { beat: 161.2, file: 'Confirmation chime 01.mp3', volume: 0.7, leadFrames: 3 },

 // 95.2: Câu chốt / Logo cuối (Sub bass hit)
 { beat: 190.4, file: 'dragon-studio-deep-sub-drop-450456.mp3', volume: 0.8, leadFrames: 3 },
];
