export const FPS = 30;
export const BPM = 120;
export const BEAT = (FPS * 60) / BPM; // 15 frames per beat

export const beat = (n: number) => Math.round(n * BEAT);
export const bar = (n: number) => beat(n * 4);
export const half = (n: number) => beat(n / 2);

export const snapToBeat = (frame: number) => Math.round(frame / BEAT) * BEAT;
