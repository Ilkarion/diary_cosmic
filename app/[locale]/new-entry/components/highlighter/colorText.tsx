"use client";

import { useEffect, useRef, useState } from "react";

import { ResearchTask } from "../../entry-types/types";

/* ---------------- types ---------------- */

type Tag = {
  name: string;
  color: string;
};

type ParsedNode = {
  text: string;
  color: string | null;
  tag_name: string | null;
};

/* ---------------- utils ---------------- */

const hexToRgb = (hex: string) => {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let c = hex.substring(1).split("");
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    const num = parseInt(c.join(""), 16);
    return `rgb(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255})`;
  }
  return hex;
};

const areColorsEqual = (a?: string | null, b?: string | null) =>
  !!a && !!b && a.replace(/\s+/g, "") === b.replace(/\s+/g, "");

/* Парсим содержимое редактора */
const parseContent = (editor: HTMLElement, tasks: Tag[]): ParsedNode[] => {
  const tasksRgb = tasks.map(t => ({ ...t, rgb: hexToRgb(t.color) }));

  const getAllTextNodes = (el: Node): Node[] =>
    el.nodeType === Node.TEXT_NODE ? [el] :
    Array.from(el.childNodes).flatMap(getAllTextNodes);

  const nodes = getAllTextNodes(editor).filter(n => n.textContent?.trim());

  return nodes.reduce<ParsedNode[]>((acc, node) => { //(accumulator, sum)
    const text = node.textContent!; // `!` - never give us null or undefined just text
    let color: string | null = null
    let parent: HTMLElement | null = node.parentElement;

    while (parent && parent !== editor) {
      const bg = getComputedStyle(parent).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") { color = bg; break; }
      parent = parent.parentElement;
    }

    const tagName = tasksRgb.find(t => areColorsEqual(t.rgb, color))?.name ?? null;
    const last = acc.at(-1);

    if (last && last.color === color && last.tag_name === tagName) last.text += text;
    else acc.push({ text, color, tag_name: tagName });

    return acc;
  }, []);
};



export default function NeonTagEditor({tasks}:{tasks:ResearchTask[]}) {
  const editorRef = useRef<HTMLDivElement>(null);

  const [json, setJson] = useState<ParsedNode[] | null>(null);

  useEffect(() => {
    document.execCommand("styleWithCSS", false, "true");
  }, []);

  /* ---------- handlers ---------- */

  const applyTag = (tag: Tag) => {
    editorRef.current?.focus();
    document.execCommand("hiliteColor", false, tag.color);
  };

  const clearFormat = () => {
    editorRef.current?.focus();
    document.execCommand("removeFormat");
    document.execCommand("hiliteColor", false, "transparent");
  }; 

  const saveJson = () => {
    if (!editorRef.current) return;
    setJson(parseContent(editorRef.current, tasks));
  };

  /* ---------- UI ---------- */

  return (
    <div className="max-w-3xl mx-auto p-6 text-[#D1D5DC]">

      {/* toolbar */}
      <div className="task-bar">
        {tasks && tasks.map((t, id) => (
          <button
            key={id}
            onClick={() => applyTag(t)}
            className="task-btn"
            style={{ borderColor: t.color, color: t.color }}
          >
            {t.name}
          </button>
        ))}
        {tasks && 
            <button onClick={clearFormat} className="clearColors">
            clear
            </button>        
        }

      </div>

      {/* editor */}
      <div
        ref={editorRef}
        contentEditable
        data-placeholder="Start typing..."
        className="min-h-[300px] p-4 bg-[#2E244B] rounded outline-none [contenteditable]:empty:before:content-[attr(data-placeholder)] [contenteditable]:empty:before:text-gray-400 [contenteditable]:empty:before:block"
      />

      {/* save */}
      <button
        onClick={saveJson}
        className="mt-4 px-6 py-2 bg-white text-black rounded font-bold"
      >
        Save JSON
      </button>

      {/* output */}
      {json && (
        <pre className="mt-4 text-xs bg-black/40 p-3 rounded max-h-48 overflow-auto">
          {JSON.stringify(json, null, 2)}
        </pre>
      )}
    </div>
  );
}
