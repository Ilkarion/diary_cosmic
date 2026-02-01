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

  // Храним "слепок" данных, чтобы разрывать цикл обновлений
  // Если пришедшие пропсы равны этому значению -> не трогаем редактор
  const lastSyncedRef = useRef<string>("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [allowDelete, setAllowDelete] = useState<boolean>(false);

  const hexToRgba = (hex: string, alpha = 0.5) => {
    if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

    /* ---------- OUTGOING: Editor -> Parent ---------- */
  const handleEditorChange = () => {
    const q = quillRef.current;
    if (!q) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      // Парсим Delta -> Highlight[]
      const delta = q.getContents();
      const newHighlights: Highlight[] = [];

      delta.ops?.forEach(op => {
        if (typeof op.insert !== 'string') return;
        const color =
          typeof op.attributes?.background === 'string'
            ? op.attributes.background
            : "";

        // Логика объединения соседних одинаковых цветов
        const last = newHighlights.at(-1);
        if (last && last.color === color) {
          last.text += op.insert;
        } else {
          newHighlights.push({ text: op.insert, color });
        }
      });

      const newFingerprint = JSON.stringify(newHighlights);

      // Если после парсинга данные не изменились (например, просто кликнули, но ничего не ввели)
      if (newFingerprint === lastSyncedRef.current) return;

      // ВАЖНО: Обновляем реф ПЕРЕД отправкой родителю.
      // Это гарантирует, что когда родитель вернет нам эти же данные через пропсы,
      // Effect выше (INCOMING) увидит совпадение и НЕ будет делать setContents.
      lastSyncedRef.current = newFingerprint;

      // Отправляем наверх
      setHighLights(newHighlights);
      
      // Если нужно обновлять и tasks (researchTasks), делай это здесь или в родителе
      // setTasks(currentTasks => ...)
      
    }, 400); // Debounce
  };
  /* ---------- init quill ---------- */
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;
    
    const q = new Quill(editorRef.current, {
      placeholder: 'Start typing...',
      modules: { toolbar: false },
    });
    quillRef.current = q;

    // Слушаем изменения текста
    q.on('text-change', (delta, oldDelta, source) => {
      // Игнорируем изменения, которые мы сами вызвали через setContents('silent')
      // Но обрабатываем 'user' (ввод) и 'api' (кнопки форматирования)
      if (source !== 'silent') {
        handleEditorChange();
      }
    });
  }, []); // Run once

  /* ---------- INCOMING: Props -> Editor ---------- */
  // Этот эффект срабатывает, когда родитель обновляет highlights (например, при загрузке или undo)
  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;

    // 1. Проверяем, отличается ли то, что пришло, от того, что мы уже знаем
    const incomingFingerprint = JSON.stringify(highlights);
    
    if (incomingFingerprint === lastSyncedRef.current) {
      // ЭТО FIX: Данные те же самые, что мы только что отправили (или уже отрисовали).
      // Не трогаем редактор, чтобы не сбить курсор.
      return;
    }

    // 2. Если данные реально новые (Load, Import, Undo):
    const ops = highlights.map(h => ({
      insert: h.text,
      ...(h.color
        ? { attributes: { background: hexToRgba(h.color, 0.7) } }
        : {}),
    }));

    // 3. Сохраняем позицию курсора (на всякий случай)
    const range = q.getSelection();

    // 4. Обновляем редактор с флагом 'silent', чтобы не вызвать text-change
    q.setContents(ops, 'silent');


    
    // 5. Обновляем наш реф, чтобы знать, что это состояние актуально
    lastSyncedRef.current = incomingFingerprint;

    // 6. Восстанавливаем курсор
    if (range) {
      // q.setSelection иногда требует небольшого таймаута при полной замене контента, 
      // но при 'silent' часто работает и синхронно. Оставим синхронно.
      q.setSelection(range.index, range.length);
    }

  }, [highlights]); // Зависимость только от highlights


  /* ---------- Actions ---------- */
  const handleTag = (task: ResearchTask, nameBtn: string) => {
    const q = quillRef.current;
    if (!q) return;

    if (!allowDelete) {
      q.focus();
      const range = q.getSelection();
      if (range) {
        q.format('background', hexToRgba(task.color, 0.6));
        // format вызовет 'text-change' с source='api', который обработается handleEditorChange
      }
      return;
    }

    // delete mode
    const filteredColorTags = researchTasks.filter(btn => nameBtn !== btn.name);
    setTasks(filteredColorTags); 
    // Здесь мы обновляем только таски. Если удаление таска должно влиять на текст (убирать цвет),
    // то нужно пройтись по highlights и почистить их, но обычно это просто удаление кнопки.
  };

  const clearFormat = () => {
    const q = quillRef.current;
    if (!q) return;
    q.focus();
    const range = q.getSelection();
    if (range) {
      q.format('background', false);
    }
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
