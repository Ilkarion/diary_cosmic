'use client';

import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import './ColorResearch.scss';

type Tag = {
  id: number;
  name: string;
  color: string;
};

/* ---------- utils ---------- */

const hexToRgb = (hex: string): string => {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return hex;

  let value = hex.substring(1);
  if (value.length === 3) {
    value = value
      .split('')
      .map(c => c + c)
      .join('');
  }

  const num = parseInt(value, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return `rgb(${r}, ${g}, ${b})`;
};

/* ---------- component ---------- */

export default function ColorResearch() {
  const [tags] = useState<Tag[]>([
    { id: 1, name: 'dream', color: '#3b82f6' },
    { id: 2, name: 'feat', color: '#ef4444' },
  ]);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder: 'Start typing...',
      modules: { toolbar: false },
    });
  }, []);

  const applyTag = (tag: Tag) => {
    const quill = quillRef.current;
    if (!quill) return;

    quill.focus();
    const range = quill.getSelection();
    if (range) {
      quill.format('background', tag.color);
    }
  };

  const clearFormat = () => {
    const quill = quillRef.current;
    if (!quill) return;

    quill.focus();
    const range = quill.getSelection();
    if (range) {
      quill.format('background', false);
    }
  };

  return (
    <div className="color-research">

      <div className="toolbar">
        {tags.map(tag => (
          <button
            key={tag.id}
            onMouseDown={e => e.preventDefault()}
            onClick={() => applyTag(tag)}
            className="tag-btn"
            style={{ backgroundColor: `${tag.color}20` }}
          >
            <i style={{ backgroundColor: tag.color }} />
            {tag.name}
          </button>
        ))}

        <button
          onMouseDown={e => e.preventDefault()}
          onClick={clearFormat}
          className="clear-btn"
        >
          Clear
        </button>
      </div>

      <div className="editor-wrapper">
        <div ref={editorRef} />
      </div>
    </div>
  );
}
