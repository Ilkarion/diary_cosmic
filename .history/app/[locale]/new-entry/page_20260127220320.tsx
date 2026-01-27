"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import Delta from "quill-delta";
import { Highlight, ResearchTask } from "./entry-types/types";

type Props = {
  initialData?: {
    researchTasks: ResearchTask[];
    highlights: Highlight[];
  };
};

export default function ColorResearch({ initialData }: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      placeholder: "Start typing...",
      modules: { toolbar: false },
    });

    // 🔹 render saved text + highlights
    if (initialData?.highlights?.length) {
      const ops = initialData.highlights.map((h) => ({
  insert: h.text,
  ...(h.color !== "null"
    ? { attributes: { background: h.color } }
    : {}),
}));

const delta = new Delta(ops);

quillRef.current.setContents(delta);
    }
  }, [initialData]);

  return (
    <div
      ref={editorRef}
      style={{
        minHeight: "150px",
        background: "#fff",
      }}
    />
  );
}
