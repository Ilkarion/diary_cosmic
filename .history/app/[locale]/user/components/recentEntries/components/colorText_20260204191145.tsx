'use client';

import { Highlight } from "@/app/[locale]/new-entry/entry-types/types"; // путь к твоему типу
import './colorText.scss';



export default function ColorText({ highlights}:{highlights : Highlight[]}) {
  // функция конвертирует hex в rgba
  const hexToRgba = (hex: string) => {
    if (!hex) return '';
    if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${0.7})`;
  };

  // объединяем соседние куски с одинаковым фоном
  const mergedHighlights = highlights.reduce<Highlight[]>((acc, curr) => {
    const last = acc[acc.length - 1];
    if (last && last.color === curr.color) {
      last.text += curr.text;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);

  return (
    <div className="color-text">
      {mergedHighlights.map((h, i) => (
        <span
          key={i}
          style={{
            backgroundColor: h.color ? hexToRgba(h.color) : 'transparent',
          }}
        >
          {h.text}
        </span>
      ))}
    </div>
  );
}
