"use client";
import React, { useMemo, useRef, useState } from "react";
import { RecordType, ColorTag, NodePositions } from "../../types/detectiveTypes";
import DetectiveNode from "../DetectiveNode/DetectiveNode";
import "./DetectiveBoard.scss";

interface BoardProps {
  records: RecordType[];
  allColorTags: ColorTag[];
}

export default function DetectiveBoard({ records, allColorTags }: BoardProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  // Viewport State
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Only store positions that the USER has changed.
  const [manualPositions, setManualPositions] = useState<NodePositions>({});
  
  const [isPanning, setIsPanning] = useState(false);
  const startPan = useRef({ x: 0, y: 0 });

  // 1. Calculated Layout (The "Default" Grid)
  // This runs purely during render, no effects, no setState loops.
  const defaultPositions = useMemo(() => {
    const pos: NodePositions = {};
    const COLUMNS = 4;
    const X_GAP = 300;
    const Y_GAP = 250;

    records.forEach((rec, index) => {
      const col = index % COLUMNS;
      const row = Math.floor(index / COLUMNS);
      pos[rec.id_record] = {
        x: 100 + col * X_GAP + (row % 2) * 50,
        y: 100 + row * Y_GAP
      };
    });
    return pos;
  }, [records]);

  // Helper to get final position (Manual Override > Default)
  const getPosition = (id: string) => {
    return manualPositions[id] ?? defaultPositions[id] ?? { x: 0, y: 0 };
  };

  // 2. Handle Node Drag End
  const handleNodeUpdate = (id: string, x: number, y: number) => {
    setManualPositions(prev => ({
      ...prev,
      [id]: { x, y }
    }));
  };

  // 🧭 Pan
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && (e.target as HTMLElement).closest('.detective-node')) return;

    setIsPanning(true);
    startPan.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    setOffset({
      x: e.clientX - startPan.current.x,
      y: e.clientY - startPan.current.y,
    });
  };

  const onMouseUp = () => setIsPanning(false);

  // 🔍 Zoom
  const onWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const ZOOM_SENSITIVITY = 0.001;
      const delta = -e.deltaY; 
      const factor = Math.exp(delta * ZOOM_SENSITIVITY);
      
      setScale((prev) => {
        const next = prev * factor;
        return Math.min(3, Math.max(0.2, next));
      });
    } else {
        setOffset(prev => ({
            x: prev.x - e.deltaX,
            y: prev.y - e.deltaY
        }));
    }
  };

  const recenter = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="detective-board">
      <div className="toolbar">
        <button onClick={recenter} className="recenter-btn">
             Recenter View
        </button>
      </div>

      <div
        className="viewport"
        ref={viewportRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        <div
          className="canvas"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: '0 0'
          }}
        >
          {records.map((r) => {
             const pos = getPosition(r.id_record);
             return (
                <DetectiveNode 
                    key={r.id_record} 
                    record={r} 
                    x={pos.x}
                    y={pos.y}
                    scale={scale}
                    onDragEnd={handleNodeUpdate}
                />
             );
          })}
        </div>
      </div>
    </div>
  );
}
