import TextHighlighter from "@/components/fancy/text/text-highlighter";
import { JSX } from "react";

export default function TextHighlight({
  value,
  highlights,
}: {
  value: string;
  highlights: { text: string; color: string }[];
}) {
  let result: (JSX.Element | string)[] = [value];

  highlights.forEach((h) => {
    result = result.flatMap((part) =>
      typeof part === "string"
        ? splitWithHighlight(part, h.text, h.color)
        : [part]
    );
  });

  return <>{result}</>;
}

// Разделяет текст и вставляет TextHighlighter
function splitWithHighlight(full: string, highlight: string, color: string) {
  const parts = full.split(highlight);

  if (parts.length === 1) return [full];

  const out: (JSX.Element | string)[] = [];
  parts.forEach((p, i) => {
    out.push(p);
    if (i < parts.length - 1) {
      out.push(
        <TextHighlighter
        key={highlight + color + i}
        highlightColor={color}
        >
        {highlight}
        </TextHighlighter>
      );
    }
  });

  return out;
}
