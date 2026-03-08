'use client'

import { useState, useEffect } from 'react'
import {
  ReactFlow,
  Node,
  useNodesState
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import ShowInfoNode from './components/customNodes/showInfoNode'
import { dailyRecord, AllTags_Records } from '../allTypes/typesTS'
import { fetchDiary } from "../allFunctions/newEntry/functions"
import { addTextErrors } from '../store/errorsStore/functions'
import { 
  getFetchedOnceStatus,
  getRecords_TagsFrontEnd,
  getUpdateStatus,
  setfetchedOnceTrue,
  setRecords_TagsStore,
  setUpdateFalse
} from '../store/recordsStore/functions'
import "./myJournal.scss"
import Link from 'next/link'

const nodeTypes = { showInfo: ShowInfoNode }

function randomLayout(records: dailyRecord[]): Node[] {
  const spacing = 260
  const spread = 120

  return records.map((record, index) => {
    const baseX = (index % 5) * spacing
    const baseY = Math.floor(index / 5) * spacing

    return {
      id: String(record.id_record),
      type: 'showInfo',
      position: {
        x: baseX + Math.random() * spread,
        y: baseY + Math.random() * spread
      },
      data: { record },
      draggable: true
    }
  })
}

export default function Page() {
  const [backData, setBackData] = useState<AllTags_Records | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [all_Color_Tags, setAll_Color_Tags] = useState<{name: string; color: string}[]>([])

  // ======= твой оригинальный useEffect =======
  useEffect(() => {
    async function initData() {
      try {
        const frontData = getRecords_TagsFrontEnd()
        const update = getUpdateStatus()
        const fetchedOnce = getFetchedOnceStatus()

        const shouldFetch = update || !fetchedOnce

        let data: AllTags_Records

        if (shouldFetch) {
          data = await fetchDiary()
          setUpdateFalse()
          setfetchedOnceTrue()
          setRecords_TagsStore(data)
        } else {
          data = frontData
        }

        setBackData(data)
        console.log(data)
        setAll_Color_Tags(data.diaryAllTags?.all_Color_Tags ?? [])

        // Фильтрация по выбранным тегам
        let filteredRecords = data.diaryRecords
        if (selectedColors.length > 0) {
          filteredRecords = data.diaryRecords.filter(record =>
            record.color_Tags.some(tag => selectedColors.includes(tag.name))
          )
        }

        setNodes(randomLayout(filteredRecords))
      } catch (error) {
        addTextErrors(`Failed to fetch diary: ${error}`, "error")
      }
    }

    initData()
  }, [selectedColors])

  const fitViewOptions = { padding: 0.5 }

  const handleFilterChange = (color: string) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color)
      } else {
        return [...prev, color]
      }
    })
  }

  const handleResetFilter = () => setSelectedColors([])

  return (
    <>
      <div className='wrapper_navigation'>
        <Link href={"/user"} className='return-link-show'>{"<--"}Back</Link>
        <div className="btns_wrapper_show">
          {all_Color_Tags.map((item, id) =>
            <button
              key={id}
              className={`btn-choose-show ${selectedColors.includes(item.name) ? 'selected' : ''}`}
              onClick={() => handleFilterChange(item.name)}
              style={{
                borderColor: item.color,
                color: selectedColors.includes(item.name) ? '#fff' : item.color,
                backgroundColor: selectedColors.includes(item.name) ? item.color : 'transparent'
              }}
            >
              {item.name}
            </button>
          )}
          <button onClick={handleResetFilter}>Show All</button>
        </div>
      </div>

      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={[]} // линии убраны
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={fitViewOptions}
          onNodesChange={onNodesChange}
          minZoom={0.05} // управление зумом только колесиком
          proOptions={{ hideAttribution: true }}
        />
      </div>
    </>
  )
}