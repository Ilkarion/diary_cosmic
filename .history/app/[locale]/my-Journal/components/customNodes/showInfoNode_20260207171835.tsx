// showInfoNode.tsx
'use client'

import ColorTagsUser from "@/app/[locale]/user/components/recentEntries/components/ColorTagsUser";
import ColorText from "@/app/[locale]/user/components/recentEntries/components/colorText";
import "./showInfoNode.scss"

import { NodeProps } from '@xyflow/react';
import { dailyRecordMap } from "../../types/detectiveTypes";

export type ColorTag = {
  name: string;
  color: string;
};

export type Highlight = {
  text: string;
  color: string;
};

export type RecordType = {
  id_record: string;
  title: string;
  created_at: string;
  highlights: Highlight[];
  color_Tags: ColorTag[];
};

type ShowInfoNodeProps = NodeProps & {
  data: {
    record: dailyRecordMap
  }
}

export default function ShowInfoNode({ data }: ShowInfoNodeProps) {
  const record_info = data.record;

  function formatDateTime(iso: string) {
  const d = new Date(iso);

  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const sec = String(d.getSeconds()).padStart(2, '0')

  return `${dd}.${mm}.${yyyy} -- ${hh}:${min}`;
}

  const short_date = formatDateTime(record_info.created_at)

  return (
    <div className="text-updater-node">
        <p className="title_record_info">{record_info.title}</p>
        <div className="divine_line_info"></div>
        <ColorTagsUser tags={record_info.color_Tags}/>
        <ColorText highlights={record_info.highlights}/>
        <p className="short-date_info">{short_date}</p>
    </div>
  );
}
