'use client'
import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [backData, setBackData] = useState<AllTags_Records | null>(null);

  // состояния ReactFlow

  const [edges, setEdges] = useState<Edge[]>([]);

  // Получение данных с сервера
  useEffect(() => {
    async function getDataAPI() {
      const data = await fetchDiary();
      if (!data) {
        alert("You don't have records. Create one! Or there might be a server issue.");
        return;
      }
      setBackData(data);
    }
    getDataAPI();
  }, []);

  // Обновление nodes и edges при изменении backData или selectedColor
const [nodes, setNodes] = useState<Node[]>(() => {
  if (!backData) return [];
  const data: dailyRecordForFlow[] = backData.diaryRecords.map((record) => ({
    id_record: record.id_record ?? `empty-${Date.now()}`,
    title: record.title,
    date: record.date,
    feels: record.feels,
    tags: record.tags,
    color_Tags: record.color_Tags,
    highlights: record.highlights,
    created_at: record.created_at ?? new Date().toISOString(),
  }));

  return buildNodesAndEdges(
    data.length > 0 ? data : [{
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
      created_at: new Date().toISOString(),
    }],
    selectedColor ?? undefined
  ).nodes;
});



  // Обработчики изменений
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const onNodeDrag: OnNodeDrag = useCallback((_, node) => {
    console.log('Node dragged:', node.id, node.position);
  }, []);

  const fitViewOptions = { padding: 0.5 };

  return (
    <>
      <div style={{ position: 'fixed', zIndex: 10 }}>
        <button onClick={() => setSelectedColor('work?')}>work?</button>
        <button onClick={() => setSelectedColor('delete')}>delete</button>
        <button onClick={() => setSelectedColor(null)}>all</button>
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
