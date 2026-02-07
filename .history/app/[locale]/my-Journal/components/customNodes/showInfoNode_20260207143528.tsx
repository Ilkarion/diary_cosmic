// showInfoNode.tsx
'use client'

import ColorTagsUser from "@/app/[locale]/user/components/recentEntries/components/ColorTagsUser";
import ColorText from "@/app/[locale]/user/components/recentEntries/components/colorText";
import "./showInfoNode.scss"

import { NodeProps } from '@xyflow/react';

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
    record: RecordType
  }
}

export default function ShowInfoNode({ data }: ShowInfoNodeProps) {
  const record_info = data.record;
  const short_date = new Date(record_info.created_at).toISOString();

  return (
    <div className="text-updater-node">
        <p className="title_record_info">{record_info.title}</p>
        <div className="divine_line_info"></div>
        <ColorTagsUser tags={record_info.color_Tags}/>
        <ColorText highlights={record_info.highlights}/>
        <p>{short_date}</p>
    </div>
  );
}
