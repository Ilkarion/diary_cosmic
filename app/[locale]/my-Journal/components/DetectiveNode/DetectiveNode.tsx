"use client";
import React, { useState, useRef, useEffect } from "react";
import { RecordType } from "../../types/detectiveTypes";
import "./detectiveNode.scss";

interface DetectiveNodeProps {
  record: RecordType;
  x: number;
  y: number;
  scale: number;
  onDrag: (id: string, x: number, y: number) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  isActive?: boolean;
  activeColor?: string;
}

interface Point {
  x: number;
  y: number;
}

export default function DetectiveNode({
  record,
  x,
  y,
  scale,
  onDrag,
  onDragEnd,
  isActive = false,
  activeColor,
}: DetectiveNodeProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [delta, setDelta] = useState<Point>({ x: 0, y: 0 });

  const startRef = useRef<Point>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    startRef.current = { x: e.clientX, y: e.clientY };
    setDelta({ x: 0, y: 0 });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const dx = (e.clientX - startRef.current.x) / scale;
    const dy = (e.clientY - startRef.current.y) / scale;

    setDelta({ x: dx, y: dy });

    onDrag(record.id_record, x + dx, y + dy);
  };

  const handleMouseUp = (e: MouseEvent) => {
    setIsDragging(false);

    const dx = (e.clientX - startRef.current.x) / scale;
    const dy = (e.clientY - startRef.current.y) / scale;

    onDragEnd(record.id_record, x + dx, y + dy);
  };

  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, scale, x, y]);

  const mainColor: string = record.color_Tags[0]?.color || "#512A84";
  const borderColor: string =
    isActive && activeColor ? activeColor : mainColor;

  return (
    <div
      className={`detective-node ${isDragging ? "dragging" : ""}`}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate(${x + delta.x}px, ${y + delta.y}px)`,
        border: `2px solid ${borderColor}`,
        boxShadow: isActive
          ? `0 0 15px ${borderColor}60, 0 4px 10px rgba(0,0,0,0.5)`
          : `0 4px 6px rgba(0,0,0,0.3)`,
        transition: isDragging
          ? "none"
          : "box-shadow 0.2s, border-color 0.2s",
      }}
    >
      <div className="node-header" style={{ borderBottom: `1px solid ${borderColor}40` }}>
        <h4>{record.title}</h4>
        <span className="date">
          {new Date(record.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="node-content">
        {record.highlights?.slice(0, 3).map((h, i) => (
          <span key={i} style={{ color: h.color }}>
            {h.text}
          </span>
        ))}
      </div>

      <div className="node-tags">
        {record.color_Tags.map((t, i) => (
          <span
            key={i}
            className="dot"
            style={{ backgroundColor: t.color }}
            title={t.name}
          />
        ))}
      </div>
    </div>
  );
}
