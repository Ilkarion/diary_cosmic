'use client';

import { useEffect, useRef } from 'react';
import Quill from 'quill';
import './colorResearch.scss';

import { ResearchTask } from '../../entry-types/types';

/* ---------------- types ---------------- */

type Tag = {
  name: string;
  color: string;
};

/* ---------------- component ---------------- */

export default function ColorResearch({
  tasks,
}: {
  tasks: ResearchTask[];
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  /* ---------- init quill ---------- */
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      placeholder: 'Start typing...',
      modules: { toolbar: false },
      theme: 'snow',
    });
  }, []);

  /* ---------- handlers ---------- */

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

  /* ---------- UI ---------- */

  return (
    <div className="color-research">

      {/* TAG PANEL (from component2) */}
      <div className="task-bar">
        
        {tasks.map((t, idx) => (
          <button
            key={idx}
            onMouseDown={e => e.preventDefault()}
            onClick={() => applyTag(t)}
            className="task-btn"
            style={{ borderColor: t.color, color: t.color }}
          >
            {t.name}
          </button>
        ))}

        <button
          onMouseDown={e => e.preventDefault()}
          onClick={clearFormat}
          className="clearColors"
        >
          clear
        </button>
      </div>

      {/* QUILL EDITOR (from component1) */}
      <div className="editor-wrapper">
        <div ref={editorRef} />
      </div>
    </div>
  );
}
