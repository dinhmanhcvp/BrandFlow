import React from 'react';
import { color, font, radius } from '../tokens';
import { Resolved, isSample } from '../lib/show';
import type { TextField, ImageField } from '../content';

interface TextBlockProps {
  resolved: Resolved;
  field: TextField;
  mode: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number;
  colorHex?: string;
  isHeading?: boolean;
  style?: React.CSSProperties;
}

export const TextBlock: React.FC<TextBlockProps> = ({
  resolved,
  field,
  mode,
  fontSize = 38,
  fontWeight = 400,
  lineHeight = 1.35,
  colorHex = color.foreground,
  isHeading = false,
  style,
}) => {
  // 1. Chế độ Empty và chưa có giá trị thật: khung giữ chỗ viền nét đứt
  if (resolved.placeholder) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: color.surfaceMuted,
          border: `1.5px dashed ${color.borderStrong}`,
          borderRadius: radius.md,
          padding: '8px 18px',
          fontFamily: font.body,
          fontSize: Math.max(28, Math.min(fontSize, 34)),
          color: color.muted,
          fontWeight: 500,
          letterSpacing: '0.01em',
          ...style,
        }}
      >
        {resolved.label}
      </div>
    );
  }

  // 2. Chế độ Short/Long có chuỗi mẫu (chưa có giá trị thật): hiển thị chuỗi mẫu trong ngoặc với màu chữ phân biệt
  const sampleText = isSample(field, mode as any);

  return (
    <div
      style={{
        fontFamily: isHeading ? font.heading : font.body,
        fontSize,
        fontWeight,
        lineHeight,
        color: sampleText ? color.muted : colorHex,
        fontStyle: sampleText ? 'italic' : 'normal',
        letterSpacing: isHeading ? '-0.02em' : '0',
        ...style,
      }}
    >
      {resolved.text}
    </div>
  );
};

interface ImageBoxProps {
  field: ImageField;
  width: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  fallbackLabel?: string;
}

export const ImageBox: React.FC<ImageBoxProps> = ({
  field,
  width,
  height,
  style,
  fallbackLabel,
}) => {
  const displayLabel = fallbackLabel || field.label || 'Ảnh sẽ bổ sung';

  if (!field.src) {
    return (
      <div
        style={{
          width,
          height: height || (typeof width === 'number' ? width / field.ratio : 'auto'),
          aspectRatio: field.ratio,
          backgroundColor: color.surfaceMuted,
          border: `1.5px dashed ${color.borderStrong}`,
          borderRadius: radius.lg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 24,
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color.muted} strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span
          style={{
            fontFamily: font.body,
            fontSize: 28,
            fontWeight: 500,
            color: color.muted,
          }}
        >
          {displayLabel}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        width,
        height,
        aspectRatio: field.ratio,
        borderRadius: radius.lg,
        overflow: 'hidden',
        border: `1.5px solid ${color.border}`,
        backgroundColor: color.surface,
        ...style,
      }}
    >
      <img
        src={field.src}
        alt={field.label}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  );
};
