'use client';

import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import './colorResearch.scss';

import { ResearchTask } from '../../entry-types/types';

/* ---------------- types ---------------- */

type HighlightNode = {
  text: string;
  color: string | null;
};

type SavedPayload = {
  researchTasks: ResearchTask[];
  highlights: HighlightNode[];
};


/* ---------------- component ---------------- */

export default function ColorResearch({
  initialData,
}: {
  initialData?: SavedPayload;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  const [saved, setSaved] = useState<SavedPayload | null>(null);

  /* ---------- init quill ---------- */
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder: 'Start typing...',
      modules: { toolbar: false },
    });

    // 🔹 render saved highlights
    if (initialData) {
      const ops = initialData.highlights.map(h => ({
        insert: h.text,
        ...(h.color ? { attributes: { background: h.color } } : {}),
    }));

      quillRef.current.setContents(ops);
    }
  }, [initialData]);

  /* ---------- actions ---------- */

  const applyTag = (task: ResearchTask) => {
    const q = quillRef.current;
    if (!q) return;

    q.focus();
    const range = q.getSelection();
    if (range) q.format('background', task.color);
  };

  const clearFormat = () => {
    const q = quillRef.current;
    if (!q) return;

    q.focus();
    const range = q.getSelection();
    if (range) q.format('background', false);
  };

  const save = () => {
    const q = quillRef.current;
    if (!q || !initialData) return;

    const delta = q.getContents();

    const highlights: HighlightNode[] = [];

    delta.ops?.forEach(op => {
      if (typeof op.insert !== 'string') return;

      const color =
        typeof op.attributes?.background === 'string'
          ? op.attributes.background
          : null;

      const last = highlights.at(-1);

      if (last && last.color === color) {
        last.text += op.insert;
      } else {
        highlights.push({ text: op.insert, color });
      }
    });

    setSaved({
      researchTasks: initialData.researchTasks,
      highlights,
    });
  };

  /* ---------- UI ---------- */

  return (
    <div className="color-research">

      {/* tag panel */}
      <div className="task-bar">
        {initialData?.researchTasks.map((t, i) => (
          <button
            key={i}
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

      {/* editor */}
      <div className="editor-wrapper">
        <div ref={editorRef} />
      </div>

      {/* save */}
      <button onClick={save} className="save-btn">
        Save
      </button>

      {/* output */}
      {saved && (
        <pre className="saved-json">
          {JSON.stringify(saved, null, 2)}
        </pre>
      )}
    </div>
  );
}
