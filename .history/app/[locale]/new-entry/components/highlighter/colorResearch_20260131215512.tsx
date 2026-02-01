'use client';

import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import './colorResearch.scss';
import { ResearchTask, Highlight } from '../../entry-types/types';

import trashIcon from "@/public/imgs/trash.svg";
import clearIcon from "@/public/imgs/clearColor.svg";
import Image from 'next/image';

/*-------------saved editor text types----------------- */
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
  const [allowDelete, setAllowDelete] = useState<boolean>(false);

  // храним последнее сохранённое состояние, чтобы сравнивать
  const lastSavedRef = useRef<string>("");

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

  /* ---------- render highlights when props change ---------- */
  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;

    if (!highlights.length) {
      q.setText('');
      lastSavedRef.current = '';
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
  }, [highlights]);

  /* ---------- auto save with debounce + diff check + cursor restore ---------- */
  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;

    let timeout: NodeJS.Timeout | null = null;

    const handleChange = () => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        const plainText = q.getText().trim();
        if (!plainText) return;

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

        // сохраняем курсор
        const range = q.getSelection();

        setSaved({
          researchTasks,
          highlights: newHighlights,
        });

        // восстанавливаем курсор
        if (range) {
          setTimeout(() => {
            q.setSelection(range.index, range.length);
          }, 0);
        }
      }, 300);
    };

    q.on('text-change', handleChange);

    return () => {
      setTimeout(()=>{console.log("before cursor moved")}, 3000)
      q.off('text-change', handleChange);
      if (timeout) clearTimeout(timeout);
    };
  }, [researchTasks]);

  /* ---------- apply saved to parent ---------- */
  useEffect(() => {
    if (!saved) return;
    setTasks(saved.researchTasks);
    setHighLights(saved.highlights);
  }, [saved, setTasks, setHighLights]);

  /* ---------- actions ---------- */
  const handleTag = (task: ResearchTask, nameBtn: string) => {
    const q = quillRef.current;
    if (!q) return;

    if (!allowDelete) {
      q.focus();
      const range = q.getSelection();
      if (range) q.format('background', hexToRgba(task.color, 0.6));
      return;
    }

    // delete mode
    const filteredColorTags = researchTasks.filter(btn => nameBtn !== btn.name);
    setSaved({
      researchTasks: filteredColorTags,
      highlights,
    });
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
      {/* tag panel */}
      <div className="task-bar">
        <div className="colorsPick">
          {researchTasks.map((t, i) => (
            <button
              key={i}
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleTag(t, t.name)}
              className={allowDelete ? "task-btn chooseDeleteColor" : "task-btn"}
              style={{ borderColor: allowDelete ? "red" : t.color, color: t.color }}
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
            <div>
              <Image src={clearIcon} alt="clear color tag" />
            </div>
          </button>

          <span className="flex items-center">|</span>

          <button
            onMouseDown={e => e.preventDefault()}
            onClick={() => setAllowDelete(prev => !prev)}
            aria-label="Delete color"
          >
            <div>
              <Image src={trashIcon} alt="delete color tag" />
            </div>
          </button>
        </div>
      </div>

      {/* editor */}
      <div className="editor-wrapper">
        <div ref={editorRef} />
      </div>
    </div>
  );
}
