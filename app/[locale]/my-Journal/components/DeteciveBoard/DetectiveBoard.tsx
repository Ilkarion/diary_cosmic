"use client";
import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
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
  const [isPanning, setIsPanning] = useState(false);
  const startPan = useRef({ x: 0, y: 0 });

  // Data State
  const [manualPositions, setManualPositions] = useState<NodePositions>({});
  const [activeTag, setActiveTag] = useState<ColorTag | null>(null);

  // 1. Начальная раскладка
  const defaultPositions = useMemo(() => {
    const pos: NodePositions = {};
    const COLUMNS = 3;
    const X_GAP = 320;
    const Y_GAP = 280;
    records.forEach((rec, index) => {
      const col = index % COLUMNS;
      const row = Math.floor(index / COLUMNS);
      pos[rec.id_record] = {
        x: 100 + col * X_GAP + (row % 2) * 50,
        y: 150 + row * Y_GAP
      };
    });
    return pos;
  }, [records]);

  // Стабильная функция получения позиции
  const getPosition = useCallback((id: string) => {
    return manualPositions[id] ?? defaultPositions[id] ?? { x: 0, y: 0 };
  }, [manualPositions, defaultPositions]);

  // 2. Линии связей (пересчитываются при перемещении нод)
  const connections = useMemo(() => {
    if (!activeTag) return [];

    const relevant = records.filter(r => r.color_Tags.some(t => t.name === activeTag.name));
    // Сортируем по дате
    relevant.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const lines = [];
    const NODE_CENTER_X = 128; // Примерно половина ширины карточки
    const NODE_CENTER_Y = 60;  // Примерно половина высоты

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
  }, [activeTag, records, getPosition]);

  // 3. Обновление координат (используется и для onDrag, и для onDragEnd)
  const handleNodeUpdate = useCallback((id: string, x: number, y: number) => {
    setManualPositions(prev => ({ ...prev, [id]: { x, y } }));
  }, []);

  // 4. Логика Паннинга (Pan)
  const handleMouseDownBoard = (e: React.MouseEvent) => {
    // Игнорируем, если кликнули на ноду (хотя stopPropagation в ноде должен сработать)
    if ((e.target as HTMLElement).closest('.detective-node')) return;
    
    setIsPanning(true);
    startPan.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  useEffect(() => {
    if (!isPanning) return;
    const onMove = (e: MouseEvent) => {
        setOffset({ x: e.clientX - startPan.current.x, y: e.clientY - startPan.current.y });
    };
    const onUp = () => setIsPanning(false);
    
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
    };
  }, [isPanning]);

  // 5. ИСПРАВЛЕНИЕ ЗУМА (Zoom Fix)
  // React onWheel является 'passive', поэтому e.preventDefault() не работает для блокировки зума браузера.
  // Нужно добавлять слушатель вручную через ref.
  useEffect(() => {
      const el = viewportRef.current;
      if (!el) return;

      const onWheel = (e: WheelEvent) => {
        if (e.ctrlKey) {
            e.preventDefault(); // Блокируем зум страницы
            const zoomSpeed = 0.001;
            const zoomFactor = Math.exp(-e.deltaY * zoomSpeed);
            
            // Используем функциональное обновление, чтобы не зависеть от scale в зависимостях
            setScale(prev => Math.min(Math.max(0.1, prev * zoomFactor), 3.0));
        } else {
            // Если не зум, то скролл (паннинг) колесиком
            setOffset(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
        }
      };

      el.addEventListener('wheel', onWheel, { passive: false }); // ВАЖНО: passive: false
      return () => el.removeEventListener('wheel', onWheel);
  }, []); // Пустой массив зависимостей, так как используем сеттеры (prev => ...)

  const recenter = () => {
      setOffset({ x: 0, y: 0 });
      setScale(1);
  };

  return (
    <div className="detective-board">
      <div className="toolbar">
         <button onClick={recenter}>Recenter</button>
         <div className="separator" />
         <button onClick={() => setActiveTag(null)} className={!activeTag ? 'active' : ''}>None</button>
         {allColorTags.map(tag => (
             <button 
                key={tag.name} 
                onClick={() => setActiveTag(tag)}
                style={{ borderColor: activeTag?.name === tag.name ? tag.color : 'transparent' }}
             >
                 <span className="dot" style={{background: tag.color}}/>
                 {tag.name}
             </button>
         ))}
      </div>

      <div 
        ref={viewportRef}
        className="viewport"
        onMouseDown={handleMouseDownBoard}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
         <div 
            className="canvas"
            style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: '0 0'
            }}
         >
            {/* SVG слой линий */}
            <svg className="connections-layer">
                <defs>
                   <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                     <polygon points="0 0, 10 3.5, 0 7" fill="#fff" fillOpacity="0.5" />
                   </marker>
                </defs>
                {connections.map((line, i) => (
                    <g key={i}>
                        <path 
                            d={`M ${line.x1} ${line.y1} C ${line.x1 + 50} ${line.y1}, ${line.x2 - 50} ${line.y2}, ${line.x2} ${line.y2}`}
                            stroke={line.color} 
                            strokeWidth={8} 
                            fill="none" 
                            opacity="0.15"
                        />
                        <path 
                            d={`M ${line.x1} ${line.y1} C ${line.x1 + 50} ${line.y1}, ${line.x2 - 50} ${line.y2}, ${line.x2} ${line.y2}`}
                            stroke={line.color} 
                            strokeWidth={2} 
                            fill="none" 
                            strokeDasharray="5,5"
                            markerEnd="url(#arrowhead)"
                        />
                    </g>
                ))}
            </svg>

            {/* Ноды */}
            {records.map(rec => {
                const pos = getPosition(rec.id_record);
                const isActive = activeTag && rec.color_Tags.some(t => t.name === activeTag.name);
                
                return (
                  <DetectiveNode
                      key={rec.id_record}
                      record={rec}
                      x={pos.x}
                      y={pos.y}
                      scale={scale}
                      onDrag={handleNodeUpdate} 
                      onDragEnd={handleNodeUpdate}
                      isActive={isActive || false}
                      activeColor={activeTag?.color}
                  />
                );
            })}
         </div>
      </div>
    </div>
  );
}
