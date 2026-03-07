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
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ShowInfoNode from './components/customNodes/showInfoNode';
import { FeelingOption, dailyRecord, AllTags_Records } from '../allTypes/typesTS';
import { buildNodesAndEdges } from '../allFunctions/myJournal/functions';
import { fetchDiary } from "../allFunctions/newEntry/functions";
import "./myJournal.scss"
import Link from 'next/link';

import { useTranslations } from 'next-intl';
import { addTextErrors } from '../store/errorsStore/functions';
import { getFetchedOnceStatus, getRecords_TagsFrontEnd, getUpdateStatus, setfetchedOnceTrue, setRecords_TagsStore, setUpdateFalse } from '../store/recordsStore/functions';

const nodeTypes = { showInfo: ShowInfoNode };


export default function Page() {
  const t = useTranslations("MyJournalPage")
  const [backData, setBackData] = useState<AllTags_Records | null>(null);
  const [all_Color_Tags, setAll_Color_Tags] = useState<{name: string; color:string}[]>()
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
      title: t("noRecords.title"),
      date: new Date().toLocaleDateString("en-US", {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
      }),
      feels: ["neutral" as FeelingOption],
      tags: [],
      color_Tags: [{ name: t("noRecords.colorTag"), color: "#00BFFF" }],
      highlights: [
        { text: t("noRecords.text1"), color: "rgba(0, 191, 255, 0.6)" },
        { text: t("noRecords.text2"), color: "" }
      ],
      created_at: new Date().toISOString()
    }];

    return buildNodesAndEdges(dataToRender, filterColor ?? undefined);
  }, [t]);

  // 1. Загрузка данных (без лишних зависимостей и setNodes внутри эффекта от нод)
useEffect(() => {

  async function initData() {
    try {

      const frontData = getRecords_TagsFrontEnd();

      const update = getUpdateStatus();
      const fetchedOnce = getFetchedOnceStatus(); // флаг из Zustand

      // ✅ fetch если update = true или данных с бэка ещё не было
      const shouldFetch = update || !fetchedOnce;

      let data: AllTags_Records;

      if (shouldFetch) { //update store diary HERE needed
        data = await fetchDiary(); // fetch только при необходимости
        setUpdateFalse();
        setfetchedOnceTrue(); // помечаем, что fetch сделали
        setRecords_TagsStore(data)
      } else {
        data = frontData;
      }

      setBackData(data);

      const { nodes, edges } = generateGraph(data, selectedColor);

      setNodes(nodes);
      setEdges(edges);

      setAll_Color_Tags(data.diaryAllTags.all_Color_Tags);

    } catch (error) {
      addTextErrors(`Failed to fetch diary: ${error}`, "error");
      throw error;
    }
  }

  initData();

}, []);

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

  }, []);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const fitViewOptions = { padding: 0.5 };

  return (
    <>
      <div className='wrapper_navigation'>
        <Link href={"/user"} className='return-link-show'>{"<--"}{t("btnReturn")}</Link>        
        <div className="btns_wrapper_show">
          {all_Color_Tags && all_Color_Tags.map((item, id) =>
            <button key={id}
              className='btn-choose-show'
              onClick={()=>handleFilterChange(item.name)} title='-'
              style={{borderColor: item.color, color: item.color}}>
            {item.name}
            </button>
          )}
          <button onClick={() => handleFilterChange(null)}>{t("btnShowAll")}</button>
        </div>
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
