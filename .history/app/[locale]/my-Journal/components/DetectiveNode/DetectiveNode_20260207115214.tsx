"use client";
import "./DetectiveNode.scss";
import { RecordType, ColorTag } from "../../types/detectiveTypes";

export default function DetectiveNode({
  record,
  position,
  onMouseDown,
  activeTag,
}: {
  record: RecordType;
  position: { x: number; y: number };
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  activeTag: ColorTag | null;
}) {
  const hasActiveTag =
    activeTag && record.color_Tags.some((t) => t.name === activeTag.name);

  return (
    <div
      className={`clue-card ${hasActiveTag ? "active" : ""}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onMouseDown={(e) => onMouseDown(e, record.id_record)}
    >
      <div className="node-header">
        <h3>{record.title}</h3>
        <span>{new Date(record.created_at).toLocaleDateString()}</span>
      </div>

      <div className="node-content">
        {record.highlights?.length ? (
          record.highlights.map((h, i) => (
            <span
              key={i}
              style={{
                backgroundColor: h.color || "transparent",
                color: h.color ? "#fff" : "#D1D5DC",
              }}
            >
              {h.text}
            </span>
          ))
        ) : (
          <i>No text content...</i>
        )}
      </div>

      <div className="node-tags">
        {record.color_Tags.map((tag, i) => (
          <span
            key={i}
            className="node-tag"
            style={{ backgroundColor: tag.color }}
            title={tag.name}
          />
        ))}
      </div>
    </div>
  );
}
