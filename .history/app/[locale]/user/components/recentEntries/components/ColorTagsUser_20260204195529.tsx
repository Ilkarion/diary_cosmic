'use client';



interface Tag {
  name: string;
  color: string;
}

export default function ColorTagsUser({ tags}:{tags:Tag[]}) {
  // функция конвертирует hex в rgba
  const hexToRgba = (hex: string) => {
    if (!hex) return '';
    if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${0.7})`;
  };

  return (
    <div className="color-tags">
      {tags.map((t, i) => (
        <span
          key={i}
          className="color-tag"
          style={{
            border: `1px solid ${t.color ? hexToRgba(t.color) : 'transparent'}`,
            color: t.color ? hexToRgba(t.color) : 'transparent',
            padding: '2px 6px',
            borderRadius: '10px',
            marginRight: '4px',
            display: 'inline-block',
          }}
        >
          {t.name}
        </span>
      ))}
    </div>
  );
}
