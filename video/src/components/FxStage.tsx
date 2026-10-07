import React, { createContext, useContext, useLayoutEffect, useRef, useState, ReactNode } from "react";
import { continueRender, delayRender } from "remotion";

export type Rect = { x: number; y: number; w: number; h: number; cx: number; cy: number };
const FxCtx = createContext<Record<string, Rect>>({});

export const useFx = (id: string): Rect | undefined => {
  const r = useContext(FxCtx)[id];
  // Remove throw, as it throws during the very first render before measurement
  return r;
};

export const useFxMany = (ids: (string | null | undefined)[]): (Rect | null)[] => {
  const ctx = useContext(FxCtx);
  return ids.map((id) => (id ? ctx[id] ?? null : null));
};

export const FxStage: React.FC<{
  width: number;
  height: number;
  children: ReactNode;
}> = ({ width, height, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const [handle] = useState(() => delayRender("fx-measure"));

  useLayoutEffect(() => {
    document.fonts.ready.then(() => {
      const root = ref.current;
      if (!root) return;
      
      const out: Record<string, Rect> = {};
      root.querySelectorAll<HTMLElement>("[data-fx]").forEach((el) => {
        let x = 0,
          y = 0,
          n: HTMLElement | null = el;
        
        while (n && n !== root) {
          x += n.offsetLeft;
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        
        out[el.dataset.fx!] = {
          x,
          y,
          w: el.offsetWidth,
          h: el.offsetHeight,
          cx: x + el.offsetWidth / 2,
          cy: y + el.offsetHeight / 2,
        };
      });
      
      setRects(out);
      continueRender(handle);
    });
  }, [handle]);

  return (
    <div ref={ref} style={{ position: "relative", width, height }}>
      <FxCtx.Provider value={rects}>{children}</FxCtx.Provider>
    </div>
  );
};
