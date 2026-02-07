"use client";
import { useState, useEffect, useRef } from "react";
import { RecordType } from "../../types/detectiveTypes";
import "./DetectiveNode.scss";

interface DetectiveNodeProps {
  record: RecordType;
  x: number;
  y: number;
  scale: number;
  onDragEnd: (id: string, x: number, y: number) => void;
}

export default function DetectiveNode({ record, x, y, scale, onDragEnd }: DetectiveNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  // Local temporary position while dragging for smoothness
  const [dragPos, setDragPos] = useState({ x, y });

  // Sync local state when parent updates props (e.g. initial layout)
  useEffect(() => {
    if (!isDragging) {
      setDragPos({ x, y });
    }
  }, [x, y, isDragging]);

  const startRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent board panning
    e.preventDefault();
    
    setIsDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { x: dragPos.x, y: dragPos.y };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate delta and divide by scale to keep 1:1 movement sync
      const dx = (e.clientX - startRef.current.x) / scale;
      const dy = (e.clientY - startRef.current.y) / scale;

      setDragPos({
        x: initialPosRef.current.x + dx,
        y: initialPosRef.current.y + dy,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Save final position to parent
      onDragEnd(record.id_record, dragPos.x, dragPos.y);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, scale, record.id_record, onDragEnd, dragPos.x, dragPos.y]);

  return (
    <div
      className={`detective-node ${isDragging ? "dragging" : ""}`}
      style={{ 
        transform: `translate(${dragPos.x}px, ${dragPos.y}px)`,
        // We use translate instead of top/left for better performance
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="node-header">
        <h4>{record.title}</h4>
        <span className="date">{new Date(record.created_at).toLocaleDateString()}</span>
      </div>
      
      <div className="node-tags">
        {record.color_Tags.map((t, i) => (
            <span key={i} className="dot" style={{backgroundColor: t.color}} title={t.name}/>
        ))}
      </div>
    </div>
  );
}
