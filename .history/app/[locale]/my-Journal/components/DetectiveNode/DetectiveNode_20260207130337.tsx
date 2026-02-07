"use client";
import React, { useState, useEffect, useRef } from "react";
import { RecordType } from "../../types/detectiveTypes";
// import "./detectiveNode.scss";

interface DetectiveNodeProps {
  record: RecordType;
  x: number;
  y: number;
  scale: number;
  // onDrag для плавного обновления линий во время перетаскивания
  onDrag: (id: string, x: number, y: number) => void; 
  onDragEnd: (id: string, x: number, y: number) => void;
  isActive?: boolean; // Подсветка, если нода часть активной связи
  activeColor?: string;
}

export default function DetectiveNode({ 
  record, 
  x, 
  y, 
  scale, 
  onDrag, 
  onDragEnd,
  isActive,
  activeColor
}: DetectiveNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x, y });

  // Синхронизация пропсов с локальным стейтом, когда не тащим
  useEffect(() => {
    if (!isDragging) {
      setDragPos({ x, y });
    }
  }, [x, y, isDragging]);

  const startRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Важно для предотвращения выделения текста

    startRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { x, y }; // Используем текущие пропсы как старт
    setDragPos({ x, y });
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - startRef.current.x) / scale;
      const dy = (e.clientY - startRef.current.y) / scale;

      const nextX = initialPosRef.current.x + dx;
      const nextY = initialPosRef.current.y + dy;

      setDragPos({ x: nextX, y: nextY });
      
      // ВАЖНО: Сообщаем родителю координаты сразу для перерисовки линий
      onDrag(record.id_record, nextX, nextY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      
      const dx = (e.clientX - startRef.current.x) / scale;
      const dy = (e.clientY - startRef.current.y) / scale;
      const finalX = initialPosRef.current.x + dx;
      const finalY = initialPosRef.current.y + dy;

      onDragEnd(record.id_record, finalX, finalY);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, scale, record.id_record, onDrag, onDragEnd]);

  // Определяем основной цвет (первый тег или дефолт)
  const mainColor = record.color_Tags[0]?.color || '#512A84';
  const borderColor = isActive && activeColor ? activeColor : mainColor;

  return (
    <div
      className={`detective-node ${isDragging ? "dragging" : ""}`}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate(${isDragging ? dragPos.x : x}px, ${isDragging ? dragPos.y : y}px)`,
        // Инлайн стили для гарантированной видимости границ
        border: `2px solid ${borderColor}`,
        boxShadow: isActive 
          ? `0 0 15px ${borderColor}60, 0 4px 10px rgba(0,0,0,0.5)` 
          : `0 4px 6px rgba(0,0,0,0.3)`,
        // Добавляем transition только когда не тащим, иначе будет лагать
        transition: isDragging ? 'none' : 'box-shadow 0.2s, border-color 0.2s'
      }}
    >
      <div className="node-header" style={{ borderBottom: `1px solid ${borderColor}40` }}>
        <h4>{record.title}</h4>
        <span className="date">{new Date(record.created_at).toLocaleDateString()}</span>
      </div>
      
      <div className="node-content">
        {/* Рендеринг highlights, если нужно */}
        {record.highlights?.slice(0, 3).map((h, i) => (
           <span key={i} style={{ color: h.color || 'inherit' }}>{h.text}</span>
        ))}
      </div>

      <div className="node-tags">
        {record.color_Tags.map((t, i) => (
            <span key={i} className="dot" style={{ backgroundColor: t.color }} title={t.name}/>
        ))}
      </div>
    </div>
  );
}
