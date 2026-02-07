'use client'
import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnNodeDrag,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ShowInfoNode from './components/customNodes/showInfoNode';
import { FeelingOption, ResearchTask, dailyRecord, AllTags_Records } from '../new-entry/entry-types/types';
import { buildNodesAndEdges } from './functions/functions';
import { fetchDiary } from '../new-entry/logicNewEntry/functions';
import "./myJournal.scss"
import Link from 'next/link';

const nodeTypes = { showInfo: ShowInfoNode };

export interface dailyRecordForFlow {
  id_record: string;
  title: string;
  date: string;
  feels: FeelingOption[];
  highlights: { text: string; color: string }[];
  color_Tags: ResearchTask[];
  tags: string[];
  created_at: string;
}

export default function App() {
  const [backData, setBackData] = useState<AllTags_Records | null>(null);
  const [all_Color_Tags, setAll_Color_Tags] = useState<{name: string; color:"string"}[]>()
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // ИСПРАВЛЕНИЕ: Явно указываем типы <Node> и <Edge>
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Генерация графа (без изменений логики)
  const generateGraph = useCallback((data: AllTags_Records | null, filterColor: string | null) => {
    const rawData = data?.diaryRecords.map((record: dailyRecord) => ({
      id_record: record.id_record,
      title: record.title,
      date: record.date,
      feels: record.feels,
      tags: record.tags,
      color_Tags: record.color_Tags,
      highlights: record.highlights,
      created_at: record.created_at ?? new Date().toISOString(),
    }));

    const dataToRender = rawData && rawData.length > 0 ? rawData : [{
      id_record: "empty-record-001",
      title: "No records found",
      date: new Date().toLocaleDateString("en-US", {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
      }),
      feels: ["neutral" as FeelingOption],
      tags: [],
      color_Tags: [{ name: "info", color: "#00BFFF" }],
      highlights: [
        { text: "You currently have no journal entries.", color: "rgba(0, 191, 255, 0.6)" },
        { text: "Create your first entry, and it will appear here.", color: "" }
      ],
      created_at: new Date().toISOString()
    }];

    return buildNodesAndEdges(dataToRender, filterColor ?? undefined);
  }, []);

  // 1. Загрузка данных (без лишних зависимостей и setNodes внутри эффекта от нод)
  useEffect(() => {
    async function initData() {
      try {
        const data = await fetchDiary();
        if (data) {
          setBackData(data);
          // Генерируем граф сразу после получения данных
          const { nodes: newNodes, edges: newEdges } = generateGraph(data, selectedColor); // selectedColor тут null, но передаем для консистентности
          setNodes(newNodes);
          setEdges(newEdges);
          setAll_Color_Tags(data.diaryAllTags.all_Color_Tags)
        }
      } catch (error) {
        console.error("Failed to fetch diary:", error);
      }
    }
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Запускаем 1 раз при маунте

  // 2. Обработчик фильтра (Event-driven update, чтобы избежать useEffect)
  const handleFilterChange = (color: string | null) => {
    setSelectedColor(color);
    if (backData) {
      const { nodes: newNodes, edges: newEdges } = generateGraph(backData, color);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  };

  const onNodeDrag: OnNodeDrag = useCallback((_, node) => {
    console.log('Node dragged:', node.id, node.position);
  }, []);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const fitViewOptions = { padding: 0.5 };

  return (
    <>
      <div className='btns_wrapper_show'>
        {all_Color_Tags && all_Color_Tags.map((item, id) => 
          <button key={id} 
            className='btn-choose-show'
            onClick={()=>handleFilterChange(item.name)} title='-'
            style={{borderColor: item.color, color: item.color}}>
          {item.name}
          </button>
        )}
        <button onClick={() => handleFilterChange(null)}>Show all</button>
        <Link href={"/user"}>Return</Link>
      </div>

      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={fitViewOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag}

        />
      </div>
    </>
  );
}
