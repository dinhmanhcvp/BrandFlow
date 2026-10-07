import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ease } from '../motion/easings';
import { useFxMany } from './FxStage';

const W = 1920;
const H = 1080;

export type Shot = {
  at: number;
  type: 'push' | 'pull' | 'focus' | 'whipPan' | 'zRush';
  target?: string;
  scale?: number;
  frames?: number;
};

export const CameraRig: React.FC<{ shots: Shot[]; children: React.ReactNode }> = ({ shots, children }) => {
  const frame = useCurrentFrame();
  
  if (shots.length > 2) {
    console.warn("CameraRig: quá 2 camera move trong một cảnh!");
  }

  const targetIds = shots.map((sh) => sh.target);
  const ctx = useFxMany(targetIds);

  let cur = { s: 1, tx: 0, ty: 0, blur: 0, bright: 1, whip: 0 };
  
  for (let i = 0; i < shots.length; i++) {
    const sh = shots[i];
    const rect = ctx[i];
    
    const s2 = sh.type === 'pull' ? 1 : sh.type === 'focus' ? 1.5 : sh.type === 'zRush' ? 6 : Math.min(sh.scale ?? 1.35, 1.6);
    
    // whipPan doesn't use standard tx/ty target, it just shifts W pixels
    let to = { s: s2, tx: 0, ty: 0, blur: 0, bright: 1, whip: 0 };
    
    if (rect && sh.type !== 'whipPan') {
      to.tx = W / 2 - rect.cx * s2;
      to.ty = H / 2 - rect.cy * s2;
    }

    if (sh.type === 'focus') {
      to.blur = 6;
      to.bright = 0.6;
    }
    
    if (sh.type === 'whipPan') {
      to.whip = -1920; 
      to.s = cur.s;
      to.tx = cur.tx;
      to.ty = cur.ty;
    }

    const d = sh.frames ?? (sh.type === 'pull' ? 18 : sh.type === 'whipPan' ? 8 : sh.type === 'zRush' ? 16 : 24);
    
    const t = interpolate(frame, [sh.at, sh.at + d], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: sh.type === 'whipPan' ? ease.snap : sh.type === 'pull' ? ease.out : ease.inOut
    });
    
    cur = {
      s: cur.s + (to.s - cur.s) * t,
      tx: cur.tx + (to.tx - cur.tx) * t,
      ty: cur.ty + (to.ty - cur.ty) * t,
      blur: cur.blur + (to.blur - cur.blur) * t,
      bright: cur.bright + (to.bright - cur.bright) * t,
      whip: cur.whip + (to.whip - cur.whip) * t,
    };
    
    if (frame < sh.at + d) break; // Subsequent shots don't run yet
  }

  return (
    <div style={{ width: W, height: H, overflow: 'hidden' }}>
      <div 
        style={{ 
          transformOrigin: '0 0', 
          transform: `translateX(${cur.whip}px) translate(${cur.tx}px, ${cur.ty}px) scale(${cur.s})`,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};
