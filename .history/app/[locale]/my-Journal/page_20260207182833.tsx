'use client'
import { useState, useMemo, useCallback } from 'react';
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
import { dailyRecordMap } from './types/detectiveTypes';
import { buildNodesAndEdges } from './functions/functions';

const nodeTypes = { showInfo: ShowInfoNode };

export default function App() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const objToShow: dailyRecordMap[] = [
    {
      "title": "test001",
      "date": "Saturday, February 7, 2026",
      "feels": ["frustrated"],
      "tags": [],
      "color_Tags": [{ "name": "work?", "color": "#66e0ff" }],
      "highlights": [
        { "text": "hm hm hmhm hmhm", "color": "rgba(102, 224, 255, 0.6)" },
        { "text": "h mh mhmh\n", "color": "" }
      ],
      "id_record": "e678e51d-e0ca-4487-b3d8-0173a8d20e14",
      "created_at": "2026-02-07T16:06:01.571657+00:00"
    },
    {
      "title": "testing new page ",
      "date": "Saturday, February 7, 2026",
      "feels": ["peacful", "thoughtful"],
      "tags": [],
      "color_Tags": [
        { "name": "work?", "color": "#66e0ff" },
        { "name": "plans", "color": "#00ff9d" }
      ],
      "highlights": [
        { "text": "My Journal.", "color": "rgba(0, 255, 157, 0.6)" },
        { "text": " Here i will create \"map\" ", "color": "" },
        { "text": "to connect", "color": "rgba(102, 224, 255, 0.6)" },
        { "text": " records with simmilars color_Tags.\n", "color": "" }
      ],
      "id_record": "f89dc86e-0d0a-4425-aba1-716c84ec4f5d",
      "created_at": "2026-02-07T15:27:07.415936+00:00"
    },
    {
      "title": "Successfully deleted record yaaaaay",
      "date": "Friday, February 6, 2026",
      "feels": ["happy", "inspired"],
      "tags": ["hello", "abrakadabra"],
      "color_Tags": [
        { "name": "delete", "color": "#ff0026" },
        { "name": "work?", "color": "#66e0ff" }
      ],
      "highlights": [
        { "text": "deleted", "color": "rgba(255, 0, 38, 0.6)" },
        { "text": ". That take me 30minutes. But im done with that part. ", "color": "" },
        { "text": "*fiuf*", "color": "rgba(102, 224, 255, 0.6)" },
        { "text": "\n", "color": "" }
      ],
      "id_record": "5cb35e05-b4b7-4860-8c80-f9673dbd58cd",
      "created_at": "2026-02-06T21:02:28.507282+00:00"
    },
    {
      "title": "delete in \"settings\" page  globally from all_tags / all_Color_Tags.",
      "date": "Thursday, February 5, 2026",
      "feels": ["inspired", "thoughtful", "sad"],
      "tags": ["edit", "plans"],
      "color_Tags": [
        { "name": "delete", "color": "#ff0026" },
        { "name": "plans", "color": "#00ff9d" },
        { "name": "work?", "color": "#66e0ff" }
      ],
      "highlights": [
        { "text": "also u need", "color": "rgba(102, 224, 255, 0.6)" },
        { "text": " implementing editing your records from \"recently\" and \"map\" pages\n", "color": "" }
      ],
      "id_record": "57014ec1-b6b1-4829-8add-97b91faa6ca3",
      "created_at": "2026-02-05T18:47:45.303682+00:00"
    }
  ];
  const data: dailyRecordMap[] = objToShow;

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    return buildNodesAndEdges(data, selectedColor ?? undefined);
  }, [data, selectedColor]);

  // ✅ состояния для ReactFlow
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // обработчики изменений
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

  // ✅ обработчик перетаскивания
  const onNodeDrag: OnNodeDrag = useCallback((_, node) => {
    // node.position уже обновляется автоматически в ReactFlow,
    // здесь можно добавить логи или кастомную логику
    console.log('Node dragged:', node.id, node.position);
  }, []);

  return (
    <>
      {/* фильтр по цвету */}
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
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag} // теперь карточки реально можно перемещать
        />
      </div>
    </>
  );
}
