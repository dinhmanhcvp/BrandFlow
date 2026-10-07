import { Easing } from "remotion";

export const ease = {
  out: Easing.bezier(0.1, 0.9, 0.2, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  snap: Easing.bezier(0.2, 0, 0, 1),
  in: Easing.in(Easing.cubic)
};
