"use client";
import { useState, useEffect, useRef } from "react";
import { RecordType } from "../../types/detectiveTypes";
import "./detectiveNode.scss";

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

  const startRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault();
    
    // 1. Capture where we started
    startRef.current = { x: e.clientX, y: e.clientY };
    // 2. Capture the current valid position from props
    initialPosRef.current = { x, y };
    // 3. Initialize local drag state
    setDragPos({ x, y });
    
    setIsDragging(true);
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

    // FIXED: Added 'e: MouseEvent' argument here
    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      
      // Calculate final position using the event data directly for accuracy
      const currentDx = (e.clientX - startRef.current.x) / scale;
      const currentDy = (e.clientY - startRef.current.y) / scale;
      
      const finalX = initialPosRef.current.x + currentDx;
      const finalY = initialPosRef.current.y + currentDy;
      
      onDragEnd(record.id_record, finalX, finalY);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, scale, record.id_record, onDragEnd]);

  // RENDER LOGIC:
  // If dragging, show local state (smooth 60fps).
  // If idle, show props (source of truth from parent).
  const currentX = isDragging ? dragPos.x : x;
  const currentY = isDragging ? dragPos.y : y;

  return (
    <div
      className={`detective-node ${isDragging ? "dragging" : ""}`}
      style={{ 
        transform: `translate(${currentX}px, ${currentY}px)`,
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
