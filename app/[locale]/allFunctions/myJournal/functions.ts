// layout.ts
import { Node, Edge } from '@xyflow/react';
import { dailyRecordForFlow } from '../../allTypes/typesTS';

export function buildNodesAndEdges(
  records: dailyRecordForFlow[],
  selectedColor?: string
): { nodes: Node[]; edges: Edge[] } {
  const VERTICAL_GAP = 300;    // the distance between cards on a single day
  const HORIZONTAL_GAP = 480;  // the interval between days
  const TIME_SHIFT = 100;      // a right shift for later times on the same day

  const filtered = selectedColor
    ? records.filter((r) =>
        r.color_Tags.some((t) => t.name === selectedColor)
      )
    : records;

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const groups: Record<string, dailyRecordForFlow[]> = {};
  sorted.forEach((r) => {
    const d = new Date(r.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let xBase = 0;
  let prevDayLastNodeId: string | null = null;

  const dayKeys = Object.keys(groups);

  dayKeys.forEach((dayKey) => {
    const dayRecords = groups[dayKey];

    // Creating nodes for the current day
    dayRecords.forEach((record, i) => {
      const currentPosition = {
        x: xBase + i * TIME_SHIFT,
        y: i * VERTICAL_GAP,
      };

      const currentNode: Node = {
        id: record.id_record,
        type: 'showInfo',
        position: currentPosition,
        data: { record },
      };

      nodes.push(currentNode);

      // Intraday: Connecting Vertically from Bottom to Top
      if (i > 0) {
        edges.push({
          id: `${dayRecords[i - 1].id_record}-${currentNode.id}`,
          source: dayRecords[i - 1].id_record,
          target: currentNode.id,
          sourceHandle: 'bottom',
          targetHandle: 'top',
          type: 'smooth',
        });
      }
    });

    // Between Days: Connect the last card of this day to the first card of the next day
    if (prevDayLastNodeId) {
      const firstNodeNextDay = dayRecords[0];
      edges.push({
        id: `${prevDayLastNodeId}-${firstNodeNextDay.id_record}`,
        source: prevDayLastNodeId,
        target: firstNodeNextDay.id_record,
        sourceHandle: 'right',
        targetHandle: 'left',
        type: 'smoothstep',
      });
    }

    // The last node of the day to connect to the next day
    prevDayLastNodeId = dayRecords[dayRecords.length - 1].id_record;

    xBase += HORIZONTAL_GAP;
  });

  return { nodes, edges };
}

