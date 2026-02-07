"use client";
import React, { useMemo, useRef, useState, useCallback } from "react";
import { RecordType, ColorTag, NodePositions } from "../../types/detectiveTypes";
import DetectiveNode from "../DetectiveNode/DetectiveNode";
import "./detectiveBoard.scss";

interface BoardProps {
  records: RecordType[];
  allColorTags: ColorTag[];
}

export default function DetectiveBoard({ records, allColorTags }: BoardProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  // Viewport State
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // Interaction State
  const [manualPositions, setManualPositions] = useState<NodePositions>({});
  const [activeTag, setActiveTag] = useState<ColorTag | null>(null);
  
  const [isPanning, setIsPanning] = useState(false);
  const startPan = useRef({ x: 0, y: 0 });

  // 1. Calculated Layout (Default Grid)
  const defaultPositions = useMemo(() => {
    const pos: NodePositions = {};
    const COLUMNS = 3;
    const X_GAP = 320;
    const Y_GAP = 280;

    records.forEach((rec, index) => {
      const col = index % COLUMNS;
      const row = Math.floor(index / COLUMNS);
      pos[rec.id_record] = {
        x: 100 + col * X_GAP + (row % 2) * 60,
        y: 150 + row * Y_GAP
      };
    });
    return pos;
  }, [records]);

  // FIX: Wrap getPosition in useCallback so it's stable
  const getPosition = useCallback((id: string) => {
    return manualPositions[id] ?? defaultPositions[id] ?? { x: 0, y: 0 };
  }, [manualPositions, defaultPositions]);

  // 2. Calculate Lines based on Active Tag
  const connections = useMemo(() => {
    if (!activeTag) return [];

    const relevant = records.filter(r => 
      r.color_Tags.some(t => t.name === activeTag.name)
    );

    relevant.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const lines = [];
    const NODE_CENTER_X = 120; // Adjust based on your card width/2
    const NODE_CENTER_Y = 60;  // Adjust based on your card height/2

    for (let i = 0; i < relevant.length - 1; i++) {
      const startId = relevant[i].id_record;
      const endId = relevant[i + 1].id_record;
      
      const startPos = getPosition(startId);
      const endPos = getPosition(endId);

      lines.push({
        x1: startPos.x + NODE_CENTER_X,
        y1: startPos.y + NODE_CENTER_Y,
        x2: endPos.x + NODE_CENTER_X,
        y2: endPos.y + NODE_CENTER_Y,
        color: activeTag.color
      });
    }
    return lines;
  }, [activeTag, records, getPosition]); // Now depends on stable getPosition

  // 3. Node Drag Handler
  const handleNodeUpdate = useCallback((id: string, x: number, y: number) => {
    setManualPositions(prev => ({ ...prev, [id]: { x, y } }));
  }, []);

  // 4. Pan & Zoom Logic
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && (e.target as HTMLElement).closest('.detective-node')) return;
    setIsPanning(true);
    startPan.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    setOffset({ x: e.clientX - startPan.current.x, y: e.clientY - startPan.current.y });
  };

  const onMouseUp = () => setIsPanning(false);

  const onWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.001);
      setScale(p => Math.min(3, Math.max(0.2, p * factor)));
    } else {
      setOffset(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  };

  const recenter = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="detective-board">
      <div className="toolbar">
        <button onClick={recenter} className="action-btn">Recenter</button>
        <div className="separator" />
        <span className="label">Show Connection:</span>
        <button 
          className={`tag-btn ${activeTag === null ? 'active' : ''}`} 
          onClick={() => setActiveTag(null)}
        >
          None
        </button>
        {allColorTags.map(tag => (
          <button
            key={tag.name}
            className={`tag-btn ${activeTag?.name === tag.name ? 'active' : ''}`}
            onClick={() => setActiveTag(tag)}
            style={{ 
              '--tag-color': tag.color,
              borderColor: activeTag?.name === tag.name ? tag.color : 'transparent'
            } as React.CSSProperties}
          >
            <span className="dot" style={{ backgroundColor: tag.color }} />
            {tag.name}
          </button>
        ))}
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
          <svg className="connections-layer">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="20" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#fff" fillOpacity="0.5" />
              </marker>
            </defs>
            {connections.map((line, i) => (
              <g key={i}>
                <path
                  d={`M ${line.x1} ${line.y1} C ${line.x1 + 50} ${line.y1}, ${line.x2 - 50} ${line.y2}, ${line.x2} ${line.y2}`}
                  stroke={line.color}
                  strokeWidth="8"
                  fill="none"
                  opacity="0.15"
                />
                <path
                  d={`M ${line.x1} ${line.y1} C ${line.x1 + 50} ${line.y1}, ${line.x2 - 50} ${line.y2}, ${line.x2} ${line.y2}`}
                  stroke={line.color}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrow)"
                />
              </g>
            ))}
          </svg>

          {records.map((r) => {
             const pos = getPosition(r.id_record);
             const isActive = activeTag && r.color_Tags.some(t => t.name === activeTag.name);
             
             return (
                <div key={r.id_record} style={{ zIndex: isActive ? 10 : 1, position: 'absolute', top: 0, left: 0 }}>
                  <DetectiveNode 
                      record={r} 
                      x={pos.x}
                      y={pos.y}
                      scale={scale}
                      onDragEnd={handleNodeUpdate}
                  />
                </div>
             );
          })}
        </div>
      </div>
    </div>
  );
}
