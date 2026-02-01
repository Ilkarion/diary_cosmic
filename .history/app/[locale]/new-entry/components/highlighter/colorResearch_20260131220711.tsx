'use client';

import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import './colorResearch.scss';
import { ResearchTask, Highlight } from '../../entry-types/types';

import trashIcon from "@/public/imgs/trash.svg";
import clearIcon from "@/public/imgs/clearColor.svg";
import Image from 'next/image';

interface SavedPayload {
  researchTasks: ResearchTask[];
  highlights: Highlight[];
}

export default function ColorResearch({
  setTasks,
  setHighLights,
  researchTasks,
  highlights,
}: {
  setTasks: React.Dispatch<React.SetStateAction<ResearchTask[]>>;
  setHighLights: React.Dispatch<React.SetStateAction<Highlight[]>>;
  researchTasks: ResearchTask[];
  highlights: Highlight[];
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  const [saved, setSaved] = useState<SavedPayload | null>(null);

  const lastSavedRef = useRef<string>("");     // для diff
  const externalSyncRef = useRef<boolean>(true); // ⬅️ разрешаем только внешнюю загрузку

  const hexToRgba = (hex: string, alpha = 0.5) => {
    if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  /* ---------- init quill ---------- */
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      placeholder: 'Start typing...',
      modules: { toolbar: false },
    });
  }, []);

  /* ---------- apply external highlights ONCE ---------- */
  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;
    if (!externalSyncRef.current) return;

    if (!highlights.length) {
      q.setText('');
      lastSavedRef.current = '';
      externalSyncRef.current = false;
      return;
    }

    const ops = highlights.map(h => ({
      insert: h.text,
      ...(h.color
        ? { attributes: { background: hexToRgba(h.color, 0.7) } }
        : {}),
    }));

    q.setContents(ops);
    lastSavedRef.current = JSON.stringify(ops);
    externalSyncRef.current = false; // ⬅️ дальше Quill живёт сам
  }, [highlights]);

  /* ---------- autosave from quill ---------- */
  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;

    let timeout: NodeJS.Timeout | null = null;

    const handleChange = () => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        const delta = q.getContents();
        const currentOps = JSON.stringify(delta.ops ?? []);
        if (currentOps === lastSavedRef.current) return;

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

        lastSavedRef.current = currentOps;

        setSaved({
          researchTasks,
          highlights: newHighlights,
        });
      }, 400);
    };

    q.on('text-change', handleChange);

    return () => {
      q.off('text-change', handleChange);
      if (timeout) clearTimeout(timeout);
    };
  }, [researchTasks]);

  /* ---------- push to parent ---------- */
  useEffect(() => {
    if (!saved) return;
    setTasks(saved.researchTasks);
    setHighLights(saved.highlights);
  }, [saved, setTasks, setHighLights]);

  /* ---------- actions ---------- */
  const handleTag = (task: ResearchTask) => {
    const q = quillRef.current;
    if (!q) return;
    q.focus();
    const range = q.getSelection();
    if (range) q.format('background', hexToRgba(task.color, 0.6));
  };

  const clearFormat = () => {
    const q = quillRef.current;
    if (!q) return;
    q.focus();
    const range = q.getSelection();
    if (range) q.format('background', false);
  };

  /* ---------- UI ---------- */
  return (
    <div className="color-research">
      <div className="task-bar">
        <div className="colorsPick">
          {researchTasks.map((t, i) => (
            <button
              key={i}
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleTag(t)}
              className="task-btn"
              style={{ borderColor: t.color, color: t.color }}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="colorBtnSettings">
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={clearFormat}
            className="clearColors"
            aria-label="clear color"
          >
            <Image src={clearIcon} alt="clear color tag" />
          </button>
          <span>|</span>
          <button
            onMouseDown={e => e.preventDefault()}
            aria-label="Delete color"
          >
            <Image src={trashIcon} alt="delete color tag" />
          </button>
        </div>
      </div>

      <div className="editor-wrapper">
        <div ref={editorRef} />
      </div>
    </div>
  );
}
