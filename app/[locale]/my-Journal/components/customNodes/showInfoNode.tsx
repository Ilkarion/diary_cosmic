'use client'
import { Handle, NodeProps, Position } from '@xyflow/react';
import ColorTagsUser from "@/app/[locale]/user/components/recentEntries/components/ColorTagsUser";
import ColorText from "@/app/[locale]/user/components/recentEntries/components/colorText";
import { dailyRecordMap } from "../../types/detectiveTypes";
import "./showInfoNode.scss";

type ShowInfoNodeData = {
  record: dailyRecordMap;
};

export default function ShowInfoNode(props: NodeProps) {
  const { data } = props as NodeProps & { data: ShowInfoNodeData };
  const r = data.record;
  function formatDate(iso: string) {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2,'0')}.${(d.getMonth()+1)
      .toString().padStart(2,'0')}.${d.getFullYear()} ${d
      .getHours()
      .toString()
      .padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  }

  return (
    <div className="text-updater-node">
      <p className='title_record_info'>{r.title}</p>
      <div className='divine_line_info '></div>
      <ColorTagsUser tags={r.color_Tags} />
      <ColorText highlights={r.highlights} />
      <p className='short-date_info'>{formatDate(r.created_at)}</p>

    <Handle id="right" type="source" position={Position.Right} />
    <Handle id="left" type="target" position={Position.Left} />
    <Handle id="top" type="target" position={Position.Top} />
    <Handle id="bottom" type="source" position={Position.Bottom} />

    </div>
  );
}
