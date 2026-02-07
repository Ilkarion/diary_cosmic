// layout.ts
import { Node, Edge, Position } from '@xyflow/react';
import { dailyRecordMap } from '../types/detectiveTypes';




export function buildNodesAndEdges(
  records: dailyRecordMap[],
  selectedColor?: string
): { nodes: Node[]; edges: Edge[] } {


    const VERTICAL_GAP = 220;  // расстояние между карточками одного дня
    const HORIZONTAL_GAP = 400;
    const TIME_SHIFT = 80;    // сдвиг вправо для более поздних
  const filtered = selectedColor
    ? records.filter(r =>
        r.color_Tags.some(t => t.name === selectedColor)
      )
    : records;

  const sorted = [...filtered].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const groups: Record<string, dailyRecordMap[]> = {};

  sorted.forEach(r => {
    const d = new Date(r.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let xBase = 0;
let prevNodeId: string | null = null;
let prevNodePosition: { x: number; y: number } | null = null;

Object.values(groups).forEach((dayRecords) => {
  dayRecords.forEach((record, i) => {
    const currentPosition = {
      x: xBase + i * TIME_SHIFT,
      y: i * VERTICAL_GAP, // отступ между карточками в один день
    };

    const currentNode: Node = {
      id: record.id_record,
      type: 'showInfo',
      position: currentPosition,
      data: { record },
    };

    nodes.push(currentNode);

    if (prevNodeId && prevNodePosition) {
      const dx = Math.abs(prevNodePosition.x - currentPosition.x);
      const dy = Math.abs(prevNodePosition.y - currentPosition.y);

      const sourceHandle = dx > dy ? 'right' : 'bottom';
      const targetHandle = dx > dy ? 'left' : 'top';

      edges.push({
        id: `${prevNodeId}-${currentNode.id}`,
        source: prevNodeId,
        target: currentNode.id,
        sourceHandle,
        targetHandle,
      });
    }

    prevNodeId = currentNode.id;
    prevNodePosition = currentPosition;
  });

  xBase += 400; // сдвиг для следующего дня
});


  return { nodes, edges };
}


function getHandleDirection(
  from: { x: number; y: number },
  to: { x: number; y: number }
) {
  const dx = Math.abs(from.x - to.x);
  const dy = Math.abs(from.y - to.y);

  if (dx > dy) {
    return {
      sourceHandle: 'right',
      targetHandle: 'left',
    };
  }

  return {
    sourceHandle: 'bottom',
    targetHandle: 'top',
  };
}