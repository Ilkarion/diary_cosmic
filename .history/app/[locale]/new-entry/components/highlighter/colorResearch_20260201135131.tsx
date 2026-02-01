'use client';

import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';

import './colorResearch.scss';
import { ResearchTask, Highlight } from '../../entry-types/types';

import trashIcon from "@/public/imgs/trash.svg";
import clearIcon from "@/public/imgs/clearColor.svg";
import Image from 'next/image';

export default function ColorResearch({
  setTasks,
  setHighLights,
  researchTasks,
  highlights,
  setAllColorTags,
}: {
  setTasks: React.Dispatch<React.SetStateAction<ResearchTask[]>>;
  setHighLights: React.Dispatch<React.SetStateAction<Highlight[]>>;
  setAllColorTags: React.Dispatch<React.SetStateAction<ResearchTask[]>>;
  researchTasks: ResearchTask[];
  highlights: Highlight[];
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  const lastSyncedRef = useRef<string>("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [allowDelete, setAllowDelete] = useState<boolean>(false);

  const [modalTask, setModalTask] = useState<ResearchTask | null>(null);
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const hexToRgba = (hex: string, alpha = 0.5) => {
    if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleEditorChange = () => {
    const q = quillRef.current;
    if (!q) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const delta = q.getContents();
      const newHighlights: Highlight[] = [];

      delta.ops?.forEach(op => {
        if (typeof op.insert !== 'string') return;
        const color = typeof op.attributes?.background === 'string' ? op.attributes.background : "";
        const last = newHighlights.at(-1);
        if (last && last.color === color) {
          last.text += op.insert;
        } else {
          newHighlights.push({ text: op.insert, color });
        }
      });

      const newFingerprint = JSON.stringify(newHighlights);
      if (newFingerprint === lastSyncedRef.current) return;
      lastSyncedRef.current = newFingerprint;
      setHighLights(newHighlights);
    }, 400);
  };

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const q = new Quill(editorRef.current, {
      placeholder: 'Start typing...',
      modules: { toolbar: false },
    });
    quillRef.current = q;

    q.on('text-change', (_delta, _old, source) => {
      if (source !== 'silent') handleEditorChange();
    });
  }, []);

  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;

    const incomingFingerprint = JSON.stringify(highlights);
    if (incomingFingerprint === lastSyncedRef.current) return;

    const ops = highlights.map(h => ({
      insert: h.text,
      ...(h.color ? { attributes: { background: hexToRgba(h.color, 0.7) } } : {}),
    }));

    const range = q.getSelection();
    q.setContents(ops, 'silent');
    lastSyncedRef.current = incomingFingerprint;
    if (range) q.setSelection(range.index, range.length);
  }, [highlights]);

  const handleTagClick = (task: ResearchTask, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!allowDelete) {
      const q = quillRef.current;
      if (!q) return;
      const range = q.getSelection();
      if (range) q.format("background", hexToRgba(task.color, 0.6));
      return;
    }

    // Показываем модальное окно над кнопкой
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setModalPosition({ x: rect.left, y: rect.bottom + window.scrollY });
    setModalTask(task);
  };

  const removeFromEntry = () => {
    if (!modalTask) return;
    const task = modalTask;

    // Удаляем только из текущих задач
    setTasks(prev => prev.filter(t => t.name !== task.name));

    // Возвращаем тег в глобальные
    setAllColorTags(prev => {
      const exists = prev.some(t => t.name === task.name);
      return exists ? prev : [...prev, task];
    });

    setModalTask(null);
    handleEditorChange();
  };

  const deleteForever = () => {
    if (!modalTask) return;
    const task = modalTask;

    // Удаляем навсегда
    setTasks(prev => prev.filter(t => t.name !== task.name));
    setAllColorTags(prev => prev.filter(t => t.name !== task.name));

    setModalTask(null);
    handleEditorChange();
  };

  const clearFormat = () => {
    const q = quillRef.current;
    if (!q) return;
    q.focus();
    const range = q.getSelection();
    if (range) {
      q.format('background', false);
      handleEditorChange();
    }
  };

  return (
    <div className="color-research">
      <div className="task-bar">
        <div className="colorsPick">
          {researchTasks.map((t, i) => (
            <button
              key={i}
              onMouseDown={e => e.preventDefault()}
              onClick={(e) => handleTagClick(t, e)}
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
              {/* Modal for deletion choice */}
      {modalTask && (
        <div className="delete-modal">
          <button onClick={removeFromEntry}>Remove from this record</button>
          <button onClick={deleteForever}>Delete forever</button>
        </div>
      )}
      </div>

      <div className="editor-wrapper">
        <div ref={editorRef} />
      </div>
    </div>
  );
}
