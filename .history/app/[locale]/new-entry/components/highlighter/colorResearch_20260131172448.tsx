'use client';

import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import './colorResearch.scss';
import { ResearchTask, Highlight } from '../../entry-types/types';

import trashIcon from "@/public/imgs/trash.svg"
import clearIcon from "@/public/imgs/clearColor.svg"
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
  setTasks: React.Dispatch<React.SetStateAction<ResearchTask[]>>,
  setHighLights: React.Dispatch<React.SetStateAction<Highlight[]>>,
  researchTasks: ResearchTask[];
  highlights: Highlight[];
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  const [saved, setSaved] = useState<SavedPayload | null>(null);

  const [allowDelete, setAllowDelete] = useState<boolean>(false)

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
    if (!quillRef.current || !highlights.length) return;

    const ops = highlights.map(h => ({
      insert: h.text,
      ...(h.color && h.color !== ''
        ? { attributes: { background: hexToRgba(h.color, 0.7) } }
        : {}),
    }));

    quillRef.current.setContents(ops);
  }, [highlights]);


  /* ---------- actions ---------- */
  const handleTag = (task: ResearchTask, nameBtn:string) => {
    if(!allowDelete) {
      const q = quillRef.current;
      if (!q) return;
      q.focus();
      const range = q.getSelection();
      if (range) q.format('background', hexToRgba(task.color, 0.6));
    }
    

    if(nameBtn && allowDelete) {
      const filteredColorTags = researchTasks.filter(btn => nameBtn !== btn.name);
      setSaved({
      researchTasks: filteredColorTags,
      highlights
    });

    }
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
    if (!q)return;

    const delta = q.getContents();
    const newHighlights: Highlight[] = [];

    delta.ops?.forEach(op => {
      if (typeof op.insert !== 'string') return;
    if(delta.length() == 0) {
      console.log(delta)
      alert("U have nothing to save.")
    }
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

  useEffect(()=>{
    if(saved) {
      setTasks(saved.researchTasks)
      setHighLights(saved.highlights)
    }
  }, [saved])

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
              style={{ borderColor: (allowDelete ? "red": t.color), color: t.color }}
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
              <Image src={clearIcon} alt="delete color tag"/>
            </div>
          </button>
          <span className='flex items-center'>|</span>
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={()=>setAllowDelete(allowDelete)}
            aria-label="Delete color"
          >
            <div>
              <Image src={trashIcon} alt="delete color tag"/>
            </div>
          </button>
        </div>
      </div>

      {/* editor */}
      <div className="editor-wrapper">
        <div ref={editorRef} />
      </div>

      {/* save */}
      <button onClick={save} className="task-btn save-editor-text-tags">
        Save Text
      </button>
    </div>
  );
}
