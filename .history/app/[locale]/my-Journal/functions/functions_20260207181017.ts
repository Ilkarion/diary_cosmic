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

  Object.values(groups).forEach((dayRecords) => {
    dayRecords.forEach((record, i) => {
      const id = record.id_record;

    nodes.push({
        id: record.id_record,
        type: 'showInfo',
        position: {
        x: xBase + i * TIME_SHIFT,
        y: i * VERTICAL_GAP, // 👈 теперь есть отступ
        },
        data: { record },
    });

      if (prevNodeId) {
        edges.push({
          id: `${prevNodeId}-${id}`,
          source: prevNodeId,
          target: id,
        });
      }

      prevNodeId = id;
    });

    xBase += 400;
  });

  return { nodes, edges };
}
