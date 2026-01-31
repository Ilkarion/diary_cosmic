'use client';

import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import './colorResearch.scss';
import { ResearchTask, Highlight } from '../../entry-types/types';

/*-------------saved editor text types----------------- */
interface SavedPayload {
  researchTasks: ResearchTask[];
  highlights: Highlight[];
}

export default function ColorResearch({
  researchTasks,
  highlights,
}: {
  researchTasks: ResearchTask[];
  highlights: Highlight[];
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  const [saved, setSaved] = useState<SavedPayload | null>(null);

  const [allowDelete, setAllowDelete] = useState<boolean>(false)

  /* ---------- init quill ---------- */
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;
    quillRef.current = new Quill(editorRef.current, {
      placeholder: 'Start typing...',
      modules: { toolbar: false },
    });
  }, []);

  /* ---------- render highlights when props change ---------- */
  useEffect(() => {
    if (!quillRef.current || !highlights.length) return;

    const ops = highlights.map(h => ({
      insert: h.text,
      ...(h.color && h.color !== ''
        ? { attributes: { background: h.color } }
        : {}),
    }));

    quillRef.current.setContents(ops);
  }, [highlights]);

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
    if (!q) return;

    const delta = q.getContents();
    const newHighlights: Highlight[] = [];

    delta.ops?.forEach(op => {
      if (typeof op.insert !== 'string') return;

      const color =
        typeof op.attributes?.background === 'string'
          ? op.attributes.background
          : "";

      const last = newHighlights.at(-1);
      if (last && last.color === color) {
        last.text += op.insert;
      } else {
        newHighlights.push({ text: op.insert, color });
      }
    });

    setSaved({
      researchTasks,
      highlights: newHighlights,
    });
  };

  const deleteColor = () => {
    setAllowDelete(true)
  }
  /* ---------- UI ---------- */
  return (
    <div className="color-research">
      {/* tag panel */}
      <div className="task-bar">
        {researchTasks.map((t, i) => (
          <button
            key={i}
            onMouseDown={e => e.preventDefault()}
            onClick={() => applyTag(t)}
            className="task-btn"
            style={{ borderColor: (allowDelete ? "red": t.color), color: t.color }}
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

        <button
          onMouseDown={e => e.preventDefault()}
          onClick={deleteColor}
          className={allowDelete ? "chooseDeleteColor" : "clearColors"}
        >
          {allowDelete ? "press to delete" : "delete"}
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
        <pre className="saved-json">{JSON.stringify(saved, null, 2)}</pre>
      )}
    </div>
  );
}
