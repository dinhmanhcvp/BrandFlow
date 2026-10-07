import React from "react";
import { frame, colors } from "../tokens";

export const DeviceFrame: React.FC<{
  children: React.ReactNode;
  type?: "hero" | "popup";
  className?: string;
}> = ({ children, type = "hero", className = "" }) => {
  const radius = type === "hero" ? frame.borderRadius.hero : frame.borderRadius.popup;
  const isPopup = type === "popup";

  return (
    <div
      className={className}
      style={{
        borderRadius: radius,
        border: frame.border,
        boxShadow: isPopup ? `${frame.shadows.multi}, ${frame.shadows.glow}` : frame.shadows.multi,
        backgroundColor: colors.bg.base,
        overflow: "hidden",
        position: "relative",
        transformStyle: "preserve-3d",
        WebkitBoxReflect: "below 10px linear-gradient(transparent 70%, rgba(255,255,255,0.25))"
      }}
    >
      {/* Glow / Accent Edge */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          pointerEvents: "none",
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 20px rgba(6, 182, 212, ${isPopup ? 0.1 : 0.05})`,
          zIndex: 999
        }} 
      />
      {children}
    </div>
  );
};
