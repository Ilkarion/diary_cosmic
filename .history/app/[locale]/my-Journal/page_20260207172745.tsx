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
import { dailyRecordMap } from './types/detectiveTypes';


const rfStyle = {
  backgroundColor: '#B8CEFF',
};

const objToShow:dailyRecordMap[] = [
  {
    "title": "testing new page ",
    "date": "Saturday, February 7, 2026",
    "feels": [
        "peacful",
        "thoughtful"
    ],
    "tags": [],
    "color_Tags": [
        {
            "name": "work?",
            "color": "#66e0ff"
        },
        {
            "name": "plans",
            "color": "#00ff9d"
        }
    ],
    "highlights": [
        {
            "text": "My Journal.",
            "color": "rgba(0, 255, 157, 0.6)"
        },
        {
            "text": " Here i will create \"map\" ",
            "color": ""
        },
        {
            "text": "to connect",
            "color": "rgba(102, 224, 255, 0.6)"
        },
        {
            "text": " records with simmilars color_Tags.\n",
            "color": ""
        }
    ],
    "id_record": "f89dc86e-0d0a-4425-aba1-716c84ec4f5d",
    "created_at": "2026-02-07T15:27:07.415936+00:00"
},
{
    
    "title": "Successfully deleted record yaaaaay",
    "date": "Friday, February 6, 2026",
    "feels": [
        "happy",
        "inspired"
    ],
    "tags": [
        "hello",
        "abrakadabra"
    ],
    "color_Tags": [
        {
            "name": "delete",
            "color": "#ff0026"
        },
        {
            "name": "work?",
            "color": "#66e0ff"
        }
    ],
    "highlights": [
        {
            "text": "deleted",
            "color": "rgba(255, 0, 38, 0.6)"
        },
        {
            "text": ". That take me 30minutes. But im done with that part. ",
            "color": ""
        },
        {
            "text": "*fiuf*",
            "color": "rgba(102, 224, 255, 0.6)"
        },
        {
            "text": "\n",
            "color": ""
        }
    ],
    "id_record": "5cb35e05-b4b7-4860-8c80-f9673dbd58cd",
    "created_at": "2026-02-06T21:02:28.507282+00:00"
},
{
    "title": "delete in \"settings\" page  globally from all_tags / all_Color_Tags.",
    "date": "Thursday, February 5, 2026",
    "feels": [
        "inspired",
        "thoughtful",
        "sad"
    ],
    "tags": [
        "edit",
        "plans"
    ],
    "color_Tags": [
        {
            "name": "delete",
            "color": "#ff0026"
        },
        {
            "name": "plans",
            "color": "#00ff9d"
        },
        {
            "name": "work?",
            "color": "#66e0ff"
        }
    ],
    "highlights": [
        {
            "text": "also u need",
            "color": "rgba(102, 224, 255, 0.6)"
        },
        {
            "text": " implementing editing your records from \"recently\" and \"map\" pages\n",
            "color": ""
        }
    ],
    "id_record": "57014ec1-b6b1-4829-8add-97b91faa6ca3",
    "created_at": "2026-02-05T18:47:45.303682+00:00"
}
];

const initialNodes: Node[] = objToShow.map((record, index) => ({
  id: record.id_record,
  type: 'showInfo',
  position: { x: 0, y: index * 150 },
  data: { record },
}));

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
