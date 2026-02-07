'use client'
import { useState, useCallback } from 'react';
import  {ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ShowInfoNode from './components/customNodes/showInfoNode';


const rfStyle = {
  backgroundColor: '#B8CEFF',
};

const initialNodes = [
  {
    id: 'node-1',
    type: 'showInfo',
    position: { x: 0, y: 0 },
    data: { 
      record: {
        id_record: '1',
        title: 'Title',
        created_at: '2026-02-07T00:00:00Z',
        highlights: [
          { text: 'Highlight 1', color: '#800080' },
          { text: 'Highlight 2', color: 'blue' }
        ],
        color_Tags: [
          { name: 'Tag1', color: '#800080' },
          { name: 'Tag2', color: '#800080' }
        ]
      }
    },
  },
];


const nodeTypes = { showInfo: ShowInfoNode };


const initialEdges: Edge[] = [
  { id: 'n1-n2', source: 'n1', target: 'n2' },
];



export default function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}
